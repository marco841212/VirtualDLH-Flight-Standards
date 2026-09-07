export interface DescentEvaluation {
  passed: boolean;
  violations: string[];
  score: number;
  notes: string[];
}

export interface DescentData {
  altitude: number;
  targetAltitude?: number;
  speed: number;
  verticalSpeed: number;
  distanceToAirport?: number;
  speedRestrictionViolation?: boolean;
  configurationIssue?: boolean;
}

export function evaluateDescent(data: DescentData): DescentEvaluation {

  const violations: string[] = [];
  const notes: string[] = [];

  let score = 100;

  // Altitude compliance
  if (
    data.targetAltitude !== undefined &&
    Math.abs(data.altitude - data.targetAltitude) > 300
  ) {
    violations.push(
      "Descent altitude deviation exceeded SOP limits"
    );
    score -= 10;
  }

  // Vertical speed monitoring
  if (data.verticalSpeed < -2500) {
    violations.push(
      "Excessive descent rate detected"
    );
    score -= 15;
  }

  // Speed restrictions
  if (data.speedRestrictionViolation === true) {
    violations.push(
      "Exceeded published descent speed restriction"
    );
    score -= 10;
  }

  // Aircraft configuration
  if (data.configurationIssue === true) {
    violations.push(
      "Incorrect aircraft configuration during descent"
    );
    score -= 10;
  }

  // Approach preparation
  if (
    data.distanceToAirport !== undefined &&
    data.distanceToAirport < 20
  ) {
    notes.push(
      "Aircraft should be configured for approach preparation"
    );
  }

  if (violations.length === 0) {
    notes.push(
      "Descent phase completed within VirtualDLH SOP standards"
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
