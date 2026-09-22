import type {
  FlightPhase as StratosFlightPhase,
  LandingAnalysis
} from "@skyvexsoftware/stratos-sdk";

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


const STRATOS_FINAL_PHASE =
  "FINAL" as StratosFlightPhase;

const STRATOS_TAXI_PHASE =
  "TAXI" as StratosFlightPhase;

const STRATOS_TAXI_IN_PHASE =
  "TAXI_IN" as StratosFlightPhase;


const TAKEOFF_PHASE_NAMES =
  new Set([
    "TAKEOFF",
    "TAKEOFF_ROLL",
    "INITIAL_CLIMB"
  ]);


type HistoryLightField =
  | "beacon_light"
  | "strobe_light"
  | "landing_lights"
  | "taxi_light"
  | "nav_light";


export type FlightLightName =
  | "BEACON"
  | "STROBE"
  | "LANDING"
  | "TAXI"
  | "NAVIGATION";


export interface FlightLightStatus {

  beacon?: boolean;

  strobe?: boolean;

  landing?: boolean;

  taxi?: boolean;

  navigation?: boolean;

}


export interface FlightLightEvent {

  light: FlightLightName;

  state: "ON" | "OFF";

  timestamp: string;

  phase: string | null;

}


const LIGHT_FIELDS: Array<{
  light: FlightLightName;
  field: HistoryLightField;
}> = [
  { light: "BEACON", field: "beacon_light" },
  { light: "STROBE", field: "strobe_light" },
  { light: "LANDING", field: "landing_lights" },
  { light: "TAXI", field: "taxi_light" },
  { light: "NAVIGATION", field: "nav_light" }
];


function findTakeoffTelemetry(
  history: FlightTelemetrySample[]
): FlightTelemetrySample["telemetry"] | undefined {

  const phaseSample =
    [...history]
      .reverse()
      .find(
        sample =>
          TAKEOFF_PHASE_NAMES.has(
            String(sample.phase ?? "")
          )
      );

  if (phaseSample) {

    return phaseSample.telemetry;

  }


  const lowDepartureSample =
    history.find(
      sample =>
        sample.telemetry.on_ground === false &&
        typeof sample.telemetry.altitude_agl === "number" &&
        sample.telemetry.altitude_agl <= 1500 &&
        (sample.telemetry.vertical_speed ?? 0) > 0
    );


  return lowDepartureSample
    ?.telemetry;

}


function latestHistoryLight(
  history: FlightTelemetrySample[],
  field: HistoryLightField
): boolean | undefined {

  for (
    let index = history.length - 1;
    index >= 0;
    index--
  ) {

    const value =
      history[index]
        .telemetry[field];

    if (typeof value === "boolean") {

      return value;

    }

  }


  return undefined;

}


function buildLightStatus(
  history: FlightTelemetrySample[],
  telemetry: FlightTelemetry
): FlightLightStatus {

  return {

    beacon:
      latestHistoryLight(
        history,
        "beacon_light"
      ) ?? telemetry.beaconLight,

    strobe:
      latestHistoryLight(
        history,
        "strobe_light"
      ) ?? telemetry.strobeLight,

    landing:
      latestHistoryLight(
        history,
        "landing_lights"
      ) ?? telemetry.landingLights,

    taxi:
      latestHistoryLight(
        history,
        "taxi_light"
      ) ?? telemetry.taxiLight,

    navigation:
      latestHistoryLight(
        history,
        "nav_light"
      ) ?? telemetry.navLight

  };

}


function buildLightEvents(
  history: FlightTelemetrySample[]
): FlightLightEvent[] {

  const events: FlightLightEvent[] = [];

  const lastState =
    new Map<
      FlightLightName,
      boolean
    >();


  for (const sample of history) {

    for (const item of LIGHT_FIELDS) {

      const value =
        sample.telemetry[
          item.field
        ];

      if (typeof value !== "boolean") {

        continue;

      }


      if (
        lastState.get(item.light) === value
      ) {

        continue;

      }


      events.push({

        light:
          item.light,

        state:
          value ? "ON" : "OFF",

        timestamp:
          sample.timestamp,

        phase:
          sample.phase
            ? String(sample.phase)
            : null

      });


      lastState.set(
        item.light,
        value
      );

    }

  }


  return events;

}


export interface FlightEvaluation {

  phase: FlightPhase | StratosFlightPhase;

  score: number;

  passed: boolean;

  rating: string;

  trainingRequired: boolean;

  cruiseScore: number;

  takeoffScore: number | null;

  approachScore: number | null;

  landingScore: number | null;

  foqaScore: number;

  violations: string[];

  notes: string[];

  exceedances: string[];

  recommendations: string[];

  lightTelemetryAvailable: boolean;

  lightStatus: FlightLightStatus;

  lightEvents: FlightLightEvent[];

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
    telemetryHistory: FlightTelemetrySample[] = [],
    currentPhase: StratosFlightPhase | null = null
  ): FlightEvaluation {


    const phase =
      currentPhase
      ?? this.phaseDetector.detect(
        telemetry
      );


    const takeoffTelemetry =
      findTakeoffTelemetry(
        telemetryHistory
      );


    const lightStatus =
      buildLightStatus(
        telemetryHistory,
        telemetry
      );


    const lightEvents =
      buildLightEvents(
        telemetryHistory
      );


    const lightTelemetryAvailable =
      Object.values(
        lightStatus
      ).some(
        value =>
          typeof value === "boolean"
      );


    const sopResult =
      this.sopEngine.evaluateFlight({

        takeoff:
          takeoffTelemetry
            ? {

                beacon:
                  takeoffTelemetry.beacon_light,

                strobe:
                  takeoffTelemetry.strobe_light,

                landingLights:
                  takeoffTelemetry.landing_lights,

                climbRate:
                  takeoffTelemetry.vertical_speed

              }
            : undefined,

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
          item.phase === STRATOS_FINAL_PHASE
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
              sample.phase === STRATOS_TAXI_PHASE ||
              sample.phase === STRATOS_TAXI_IN_PHASE
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


      takeoffScore:
        sopResult.phaseScores.takeoff
        ?? null,


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
        ),


      lightTelemetryAvailable,


      lightStatus,


      lightEvents

    };

  }

}
