import { FlightPhase as StratosFlightPhase } from "@skyvexsoftware/stratos-sdk";
import type { LandingAnalysis } from "@skyvexsoftware/stratos-sdk";

import type {
  FlightPhaseStatistics
} from "../stratos/flightPhaseAnalyzer.js";

import type {
  FlightTelemetrySample
} from "../stratos/flightTelemetryAccumulator.js";

import {
  PhaseDetector,
  FlightTelemetry,
  FlightPhase
} from "./phaseDetector.js";

import {
  SOPEngine
} from "../sop/sopEngine.js";

import {
  evaluateApproach,
  ApproachData
} from "../sop/approachRules.js";

import {
  evaluateLanding,
  LandingData
} from "../sop/landingRules.js";

import {
  calculateFlightGrade
} from "../scoring/flightGrade.js";

import {
  FOQAScoringEngine
} from "../foqa/scoring.js";

import {
  ExceedanceEngine
} from "../foqa/exceedance.js";

import {
  FOQAEvents,
  FOQAData
} from "../foqa/events.js";



export interface FlightEvaluation {

  phase: FlightPhase;

  score: number;

  passed: boolean;

  rating: string;

  trainingRequired: boolean;

  cruiseScore: number;

  approachScore: number | null;

  landingScore: number | null;

  foqaScore: number;

  violations: string[];

  notes: string[];

  exceedances: string[];

  recommendations: string[];

}



export class FlightEvaluator {


  private phaseDetector =
    new PhaseDetector();


  private sopEngine =
    new SOPEngine();


  private foqaEvents =
    new FOQAEvents();


  private exceedanceEngine =
    new ExceedanceEngine();


  private scoringEngine =
    new FOQAScoringEngine();



  evaluate(
    telemetry: FlightTelemetry,
    landingAnalysis?: LandingAnalysis,
    phaseStatistics: FlightPhaseStatistics[] = [],
    telemetryHistory: FlightTelemetrySample[] = []
  ): FlightEvaluation {


    const phase =
      this.phaseDetector.detect(
        telemetry
      );



    const sopResult =
      this.sopEngine.evaluateFlight({

        cruise: {

          altitude:
            telemetry.altitude,

          targetAltitude:
            telemetry.cruiseAltitude,

          speed:
            telemetry.groundSpeed

        }

      });



    const finalPhaseStatistics =
      phaseStatistics.find(
        item =>
          item.phase === StratosFlightPhase.FINAL
      );


    const finalConfigurationKnown =
      finalPhaseStatistics !== undefined &&
      finalPhaseStatistics.sampleCount > 0;


    const finalGearDown =
      finalConfigurationKnown
        ? finalPhaseStatistics.gearDownPercent === 100
        : undefined;


    const finalFlapsConfigured =
      finalConfigurationKnown
        ? finalPhaseStatistics.flapsExtendedPercent === 100
        : undefined;


    const approachResult =
      landingAnalysis
        ? evaluateApproach({

            altitude:
              landingAnalysis.gateCapture
                ?.altitudeAgl
              ?? landingAnalysis.approachAltitude,

            airspeed:
              landingAnalysis.gateCapture
                ?.indicatedAirspeed
              ?? landingAnalysis.approachIas,

            verticalSpeed:
              landingAnalysis.gateCapture
                ?.verticalSpeed
              ?? landingAnalysis.approachVs,

            gearDown:
              finalGearDown,

            flapsConfigured:
              finalFlapsConfigured
              ?? (
                landingAnalysis.touchdownFlapsIndex
                  !== null
                  ? landingAnalysis.touchdownFlapsIndex > 0
                  : undefined
              )

          })
        : null;



    const reverseThrustKnown =
      telemetry.reverser1Deployed
        !== undefined ||
      telemetry.reverser2Deployed
        !== undefined;


    const landingResult =
      landingAnalysis
        ? evaluateLanding({

            touchdownRate:
              landingAnalysis.landingRateFpm,

            touchdownDistance:
              landingAnalysis.landingDistanceFt,

            reverseThrustUsed:
              reverseThrustKnown
                ? (
                    telemetry.reverser1Deployed
                      === true ||
                    telemetry.reverser2Deployed
                      === true
                  )
                : undefined,

            bouncedLanding:
              landingAnalysis.bounceCount > 0

          })
        : null;



    const historyEvents =
      telemetryHistory.flatMap(
        sample => {

          const sampleData: FOQAData = {

            airspeed:
              sample.telemetry.indicated_airspeed,

            altitude:
              sample.telemetry.altitude ?? 0,

            verticalSpeed:
              sample.telemetry.vertical_speed ?? 0,

            bankAngle:
              sample.telemetry.bank_angle,

            overspeedWarning:
              sample.telemetry.overspeed_warning,

            taxiSpeed:
              sample.phase === StratosFlightPhase.TAXI ||
              sample.phase === StratosFlightPhase.TAXI_IN
                ? sample.telemetry.ground_speed
                : undefined

          };

          return this.foqaEvents.detect(
            sampleData
          );

        }
      );


    const summaryData: FOQAData = {

      airspeed:
        telemetry.indicatedAirspeed,

      altitude:
        telemetry.altitude,

      verticalSpeed:
        telemetry.verticalSpeed,

      bankAngle:
        telemetry.bankAngle,

      overspeedWarning:
        telemetry.overspeedWarning,

      landingRate:
        landingAnalysis
          ?.landingRateFpm
        ?? telemetry.landingRate,

      approachStable:
        landingAnalysis?.gateCapture
          ? (
              landingAnalysis
                .gateCapture
                .verticalSpeed >= -1200 &&
              Math.abs(
                landingAnalysis
                  .gateCapture
                  .bank
              ) <= 35
            )
          : undefined

    };


    const summaryEvents =
      this.foqaEvents.detect(
        summaryData
      );


    const events =
      Array.from(
        new Map(
          [
            ...summaryEvents,
            ...historyEvents
          ].map(
            event => [
              event.type,
              event
            ]
          )
        ).values()
      );


    const exceedances =
      this.exceedanceEngine.evaluate(
        events
      );


    const foqaResult =
      this.scoringEngine.calculate(
        sopResult.overallScore,
        exceedances
      );



    const finalGrade =
      calculateFlightGrade({

        cruiseScore:
          sopResult.overallScore,

        approachScore:
          approachResult?.score,

        landingScore:
          landingResult?.score,

        foqaScore:
          foqaResult.finalScore

      });



    return {

      phase,

      score:
        finalGrade.score,

      passed:
        finalGrade.passed,

      rating:
        finalGrade.rating,

      trainingRequired:
        finalGrade.trainingRequired,


      cruiseScore:
        sopResult.overallScore,


      approachScore:
        approachResult?.score
        ?? null,


      landingScore:
        landingResult?.score
        ?? null,


      foqaScore:
        foqaResult.finalScore,


      violations: [

        ...sopResult.violations,

        ...(approachResult
          ?.violations ?? []),

        ...(landingResult
          ?.violations ?? [])

      ],


      notes: [

        ...sopResult.notes,

        ...(approachResult
          ?.notes ?? []),

        ...(landingResult
          ?.notes ?? [])

      ],


      exceedances:
        exceedances.map(
          item => item.event
        ),


      recommendations:
        exceedances.map(
          item => item.trainingRecommendation
        )

    };

  }

}
