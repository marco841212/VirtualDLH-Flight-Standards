export interface TaxiEvaluation {
  passed: boolean;
  violations: string[];
  score: number;
  notes: string[];
}

export interface TaxiData {
  taxiSpeed: number;
  taxiwayDeviation?: boolean;
  runwayCrossingViolation?: boolean;
  excessivePower?: boolean;
  parkingBrakeSet?: boolean;
  engineShutdownCompleted?: boolean;
}

export function evaluateTaxi(
  data: TaxiData
): TaxiEvaluation {

  const violations: string[] = [];
  const notes: string[] = [];

  let score = 100;

  // Taxi speed monitoring
  if (data.taxiSpeed > 30) {
    violations.push(
      "Excessive taxi speed detected"
    );
    score -= 10;
  }

  // Taxiway compliance
  if (data.taxiwayDeviation === true) {
    violations.push(
      "Taxiway deviation detected"
    );
    score -= 15;
  }

  // Runway crossing safety
  if (data.runwayCrossingViolation === true) {
    violations.push(
      "Unauthorized runway crossing detected"
    );
    score -= 25;
  }

  // Engine power management
  if (data.excessivePower === true) {
    violations.push(
      "Excessive thrust used during taxi"
    );
    score -= 10;
  }

  // Parking procedure
  if (data.parkingBrakeSet !== true) {
    notes.push(
      "Parking brake procedure not confirmed"
    );
  }

  // Shutdown procedure
  if (data.engineShutdownCompleted !== true) {
    notes.push(
      "Engine shutdown procedure not confirmed"
    );
  }

  if (violations.length === 0) {
    notes.push(
      "Taxi operation completed within VirtualDLH SOP standards"
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
