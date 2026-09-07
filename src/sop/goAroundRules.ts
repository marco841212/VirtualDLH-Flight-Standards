export interface GoAroundEvaluation {
  passed: boolean;
  violations: string[];
  score: number;
  notes: string[];
}

export interface GoAroundData {
  initiated: boolean;
  decisionAltitude?: number;
  pitch?: number;
  thrustApplied?: boolean;
  gearRetractionTime?: number;
  flapRetractionDelay?: number;
  missedApproachDeviation?: boolean;
}

export function evaluateGoAround(
  data: GoAroundData
): GoAroundEvaluation {

  const violations: string[] = [];
  const notes: string[] = [];

  let score = 100;

  // Go-around initiation
  if (data.initiated !== true) {
    violations.push(
      "Required go-around was not initiated"
    );
    score -= 25;
  }

  // Thrust application
  if (data.thrustApplied !== true) {
    violations.push(
      "Insufficient thrust application during go-around"
    );
    score -= 15;
  }

  // Pitch control
  if (
    data.pitch !== undefined &&
    (data.pitch < 10 || data.pitch > 18)
  ) {
    violations.push(
      "Incorrect go-around pitch attitude"
    );
    score -= 10;
  }

  // Gear sequence
  if (
    data.gearRetractionTime !== undefined &&
    data.gearRetractionTime > 60
  ) {
    violations.push(
      "Delayed landing gear retraction"
    );
    score -= 10;
  }

  // Flap sequence
  if (
    data.flapRetractionDelay !== undefined &&
    data.flapRetractionDelay > 180
  ) {
    violations.push(
      "Delayed flap retraction during missed approach"
    );
    score -= 10;
  }

  // Missed approach tracking
  if (data.missedApproachDeviation === true) {
    violations.push(
      "Missed approach procedure deviation detected"
    );
    score -= 15;
  }

  if (violations.length === 0) {
    notes.push(
      "Go-around procedure completed within VirtualDLH SOP standards"
    );
  }

  if (score < 0) {
    score = 0;
  }

  return {
    passed: violations.length === 0,
    violations,
    score,
    notes
  };
}
