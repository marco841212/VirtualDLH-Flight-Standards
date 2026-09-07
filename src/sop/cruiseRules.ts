export interface CruiseEvaluation {

  passed: boolean;

  violations: string[];

  score: number;

  notes: string[];

}



export interface CruiseData {

  altitude: number;

  targetAltitude: number;

  speed: number;

  mach?: number;

  fuelRemaining?: number;

  fuelExpected?: number;

  engineDeviation?: boolean;

  weatherDeviation?: boolean;

  altitudeDeviation?: number;

}



export function evaluateCruise(
  data: CruiseData
): CruiseEvaluation {


  const violations: string[] = [];

  const notes: string[] = [];

  let score = 100;



  /*
   * Cruise altitude compliance
   */
  if (
    Math.abs(
      data.altitude - data.targetAltitude
    ) > 300
  ) {

    violations.push(
      "Cruise altitude deviation exceeded 300 feet"
    );

    score -= 10;

  }



  /*
   * RVSM compliance
   */
  if (
    data.altitude >= 29000 &&
    data.altitude <= 41000
  ) {

    if (
      data.altitudeDeviation !== undefined &&
      data.altitudeDeviation > 200
    ) {

      violations.push(
        "RVSM altitude tolerance exceeded"
      );

      score -= 15;

    }

  }



  /*
   * Speed management
   */
  if (
    data.speed < 250 &&
    data.altitude > 10000
  ) {

    violations.push(
      "Cruise speed below operational standard"
    );

    score -= 5;

  }



  /*
   * Fuel monitoring
   */
  if (
    data.fuelRemaining !== undefined &&
    data.fuelExpected !== undefined &&
    data.fuelRemaining < data.fuelExpected
  ) {

    violations.push(
      "Fuel remaining below expected value"
    );

    score -= 10;

  }



  /*
   * Engine monitoring
   */
  if (
    data.engineDeviation === true
  ) {

    violations.push(
      "Engine performance deviation detected"
    );

    score -= 15;

  }



  /*
   * Weather deviation
   */
  if (
    data.weatherDeviation === true
  ) {

    violations.push(
      "Weather deviation procedures required"
    );

    score -= 5;

  }



  notes.push(
    "Cruise monitoring completed"
  );



  return {

    passed:
      score >= 80,

    violations,

    score,

    notes

  };

}
