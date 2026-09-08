import type { LandingAnalysis } from "@skyvexsoftware/stratos-sdk";

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
    landingAnalysis?: LandingAnalysis
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
            telemetry.altitude,

          speed:
            telemetry.groundSpeed

        }

      });



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
              telemetry.gearDown,

            flapsConfigured:
              landingAnalysis.touchdownFlapsIndex
                !== null
                ? landingAnalysis.touchdownFlapsIndex > 0
                : telemetry.flapsExtended

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



    const foqaData: FOQAData = {

      airspeed:
        telemetry.indicatedAirspeed
        ?? telemetry.groundSpeed,

      altitude:
        telemetry.altitude,

      verticalSpeed:
        telemetry.verticalSpeed,

      bankAngle:
        telemetry.bankAngle
        ?? 0,

      landingRate:
        landingAnalysis
          ?.landingRateFpm
        ?? telemetry.landingRate,

      taxiSpeed:
        telemetry.onGround
          ? telemetry.groundSpeed
          : undefined,

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



    const events =
      this.foqaEvents.detect(
        foqaData
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
