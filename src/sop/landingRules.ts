export interface LandingEvaluation {
  passed: boolean;
  violations: string[];
  score: number;
  notes: string[];
}


export interface LandingData {
  touchdownRate: number;
  touchdownDistance: number;
  runwayLength: number;
  centerlineDeviation?: number;
  reverseThrustUsed?: boolean;
  brakingIssue?: boolean;
  bouncedLanding?: boolean;
}


export function evaluateLanding(
  data: LandingData
): LandingEvaluation {

  const violations: string[] = [];
  const notes: string[] = [];

  let score = 100;


  if (data.touchdownRate < -700) {

    violations.push(
      "Hard landing detected exceeding SOP limits"
    );

    score -= 25;

  } else if (data.touchdownRate < -400) {

    violations.push(
      "Firm landing detected"
    );

    score -= 10;

  }


  if (
    data.touchdownDistance >
    data.runwayLength * 0.35
  ) {

    violations.push(
      "Landing beyond recommended touchdown zone"
    );

    score -= 15;

  }


  if (
    data.centerlineDeviation !== undefined &&
    data.centerlineDeviation > 5
  ) {

    violations.push(
      "Excessive runway centerline deviation"
    );

    score -= 10;

  }


  if (!data.reverseThrustUsed) {

    notes.push(
      "Reverse thrust not detected"
    );

  }


  if (data.brakingIssue) {

    violations.push(
      "Braking performance issue detected"
    );

    score -= 10;

  }


  if (data.bouncedLanding) {

    violations.push(
      "Bounced landing detected"
    );

    score -= 20;

  }


  notes.push(
    "Landing monitoring completed"
  );


  score = Math.max(score, 0);


  return {
    passed: score >= 80,
    violations,
    score,
    notes
  };

}
