import { evaluateLanding, LandingData }
from "../sop/landingRules.js";import {
  PhaseDetector,
  FlightTelemetry,
  FlightPhase
} from "./phaseDetector.js";

import {
  SOPEngine
} from "../sop/sopEngine.js";

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

  violations: string[];

  notes: string[];

  exceedances: string[];

  recommendations: string[];

}



export class FlightEvaluator {


  private phaseDetector: PhaseDetector;

  private sopEngine: SOPEngine;

  private foqaEvents: FOQAEvents;

  private exceedanceEngine: ExceedanceEngine;

  private scoringEngine: FOQAScoringEngine;



  constructor() {

    this.phaseDetector =
      new PhaseDetector();


    this.sopEngine =
      new SOPEngine();


    this.foqaEvents =
      new FOQAEvents();


    this.exceedanceEngine =
      new ExceedanceEngine();


    this.scoringEngine =
      new FOQAScoringEngine();

  }



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



    const score =
      this.scoringEngine.calculate(
        sopResult.overallScore,
        exceedances
      );



    const recommendations =
      exceedances.map(
        item =>
          item.trainingRecommendation
      );



    return {

      phase,

      score:
        score.finalScore,

      passed:
        score.finalScore >= 80,

      rating:
        score.rating,

      trainingRequired:
        score.trainingRequired,

      violations:
        sopResult.violations,

      notes:
        sopResult.notes,

      exceedances:
        exceedances.map(
          item => item.event
        ),

      recommendations

    };

  }

}
