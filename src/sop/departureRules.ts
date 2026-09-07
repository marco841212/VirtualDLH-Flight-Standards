export interface DepartureEvaluation {
  passed: boolean;
  violations: string[];
  score: number;
  notes: string[];
}

export interface DepartureData {
  altitude: number;
  speed: number;
  climbRate: number;
  gearUpTime?: number;
  flapRetractionTime?: number;
  sidDeviation?: number;
}

export function evaluateDeparture(data: DepartureData): DepartureEvaluation {
  const violations: string[] = [];
  const notes: string[] = [];

  let score = 100;

  // Initial climb speed monitoring
  if (data.speed > 250 && data.altitude < 10000) {
    violations.push(
      "Exceeded 250 knots below 10,000 feet"
    );
    score -= 10;
  }

  // Positive climb performance
  if (data.climbRate < 500) {
    violations.push(
      "Insufficient climb performance after departure"
    );
    score -= 10;
  }

  // Gear retraction check
  if (data.gearUpTime && data.gearUpTime > 300) {
    violations.push(
      "Landing gear remained extended too long"
    );
    score -= 5;
  }

  // Flap cleanup monitoring
  if (data.flapRetractionTime && data.flapRetractionTime > 600) {
    violations.push(
      "Delayed flap retraction"
    );
    score -= 5;
  }

  // SID tracking
  if (data.sidDeviation && data.sidDeviation > 2) {
    violations.push(
      "Excessive SID lateral deviation"
    );
    score -= 10;
  }

  if (violations.length === 0) {
    notes.push(
      "Departure procedure completed within VirtualDLH SOP standards"
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

