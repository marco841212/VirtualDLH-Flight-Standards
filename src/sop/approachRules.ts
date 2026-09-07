export interface ApproachEvaluation {

  passed: boolean;

  violations: string[];

  score: number;

  notes: string[];

}



export interface ApproachData {

  altitude: number;

  airspeed: number;

  targetSpeed: number;

  verticalSpeed: number;

  localizerDeviation?: number;

  glideslopeDeviation?: number;

  gearDown?: boolean;

  flapsConfigured?: boolean;

  autopilotDisconnected?: boolean;

  unstableApproach?: boolean;

}



export function evaluateApproach(
  data: ApproachData
): ApproachEvaluation {


  const violations: string[] = [];

  const notes: string[] = [];

  let score = 100;



  /*
   * Stabilized Approach Criteria
   */
  if (
    data.unstableApproach === true
  ) {

    violations.push(
      "Approach was unstable and requires correction or go-around consideration"
    );

    score -= 20;

  }



  /*
   * Approach Speed Control
   */
  if (
    Math.abs(
      data.airspeed - data.targetSpeed
    ) > 10
  ) {

    violations.push(
      "Approach speed deviation exceeded 10 knots"
    );

    score -= 10;

  }



  /*
   * Descent Rate Monitoring
   */
  if (
    data.verticalSpeed < -1200
  ) {

    violations.push(
      "Excessive descent rate during approach"
    );

    score -= 15;

  }



  /*
   * Localizer Tracking
   */
  if (
    data.localizerDeviation !== undefined &&
    data.localizerDeviation > 1
  ) {

    violations.push(
      "Excessive localizer deviation"
    );

    score -= 10;

  }



  /*
   * Glideslope Tracking
   */
  if (
    data.glideslopeDeviation !== undefined &&
    data.glideslopeDeviation > 1
  ) {

    violations.push(
      "Excessive glideslope deviation"
    );

    score -= 10;

  }



  /*
   * Landing Configuration
   */
  if (
    data.gearDown !== true
  ) {

    violations.push(
      "Landing gear not configured"
    );

    score -= 15;

  }



  if (
    data.flapsConfigured !== true
  ) {

    violations.push(
      "Flaps not configured for landing"
    );

    score -= 10;

  }



  /*
   * Automation Monitoring
   */
  if (
    data.autopilotDisconnected === true
  ) {

    notes.push(
      "Manual approach flown"
    );

  }



  notes.push(
    "Approach monitoring completed"
  );



  return {

    passed:
      score >= 80,

    violations,

    score,

    notes

  };

}
