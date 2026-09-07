import {
  TakeoffRules,
  TakeoffData
} from "./takeoffRules.js";

import {
  evaluateCruise,
  CruiseData
} from "./cruiseRules.js";


export interface SOPReport {

  overallScore: number;

  passed: boolean;

  violations: string[];

  phaseScores: Record<string, number>;

  notes: string[];

}



export interface FlightSOPData {

  takeoff?: TakeoffData;

  cruise?: CruiseData;

}



export class SOPEngine {


  evaluateFlight(
    flight: FlightSOPData
  ): SOPReport {


    const violations: string[] = [];

    const notes: string[] = [];

    const phaseScores: Record<string, number> = {};


    let totalScore = 0;

    let phases = 0;



    /*
     * TAKEOFF
     */
    if (flight.takeoff) {


      const takeoffRules =
        new TakeoffRules();


      const result =
        takeoffRules.evaluate(
          flight.takeoff
        );


      phaseScores.takeoff =
        result.score;


      totalScore += result.score;

      phases++;


      notes.push(
        ...result.notes
      );


      if (!result.passed) {

        violations.push(
          ...result.notes
        );

      }

    }



    /*
     * CRUISE
     */
    if (flight.cruise) {


      const result =
        evaluateCruise(
          flight.cruise
        );


      phaseScores.cruise =
        result.score;


      totalScore += result.score;

      phases++;


      notes.push(
        ...result.notes
      );


      if (!result.passed) {

        violations.push(
          ...result.violations
        );

      }

    }



    const overallScore =
      phases > 0
        ? Math.round(totalScore / phases)
        : 100;



    return {

      overallScore,

      passed:
        overallScore >= 80,

      violations,

      phaseScores,

      notes

    };

  }

}
