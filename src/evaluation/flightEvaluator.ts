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

  approachScore: number;

  landingScore: number;

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
    telemetry: FlightTelemetry
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



    const approachData: ApproachData = {

      altitude:
        telemetry.altitude,

      airspeed:
        telemetry.groundSpeed,

      targetSpeed:
        140,

      verticalSpeed:
        telemetry.verticalSpeed,

      gearDown:
        true,

      flapsConfigured:
        true,

      unstableApproach:
        false

    };



    const approachResult =
      evaluateApproach(
        approachData
      );



    const landingData: LandingData = {

      touchdownRate:
        -150,

      touchdownDistance:
        900,

      runwayLength:
        3000,

      centerlineDeviation:
        2,

      reverseThrustUsed:
        true,

      brakingIssue:
        false,

      bouncedLanding:
        false

    };



    const landingResult =
      evaluateLanding(
        landingData
      );



    const foqaData: FOQAData = {

      airspeed:
        telemetry.groundSpeed,

      altitude:
        telemetry.altitude,

      verticalSpeed:
        telemetry.verticalSpeed,

      bankAngle:
        0,

      approachStable:
        true

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
          approachResult.score,

        landingScore:
          landingResult.score,

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
        approachResult.score,


      landingScore:
        landingResult.score,


      foqaScore:
        foqaResult.finalScore,


      violations: [

        ...sopResult.violations,

        ...approachResult.violations,

        ...landingResult.violations

      ],


      notes: [

        ...sopResult.notes,

        ...approachResult.notes,

        ...landingResult.notes

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
