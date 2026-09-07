export interface EmergencyEvaluation {
  passed: boolean;
  violations: string[];
  score: number;
  notes: string[];
}

export interface EmergencyData {
  emergencyDeclared: boolean;
  checklistCompleted?: boolean;
  diversionConsidered?: boolean;
  emergencyDescentCompleted?: boolean;
  unsafeConfiguration?: boolean;
  delayedResponse?: boolean;
}

export function evaluateEmergency(
  data: EmergencyData
): EmergencyEvaluation {

  const violations: string[] = [];
  const notes: string[] = [];

  let score = 100;

  // Emergency declaration
  if (data.emergencyDeclared !== true) {
    violations.push(
      "Emergency declaration procedure not completed"
    );
    score -= 20;
  }

  // Checklist compliance
  if (data.checklistCompleted !== true) {
    violations.push(
      "Emergency checklist compliance not confirmed"
    );
    score -= 20;
  }

  // Diversion assessment
  if (data.diversionConsidered !== true) {
    notes.push(
      "Diversion decision should be evaluated based on aircraft condition"
    );
  }

  // Emergency descent
  if (data.emergencyDescentCompleted !== true) {
    violations.push(
      "Emergency descent procedure not completed"
    );
    score -= 15;
  }

  // Aircraft configuration
  if (data.unsafeConfiguration === true) {
    violations.push(
      "Unsafe aircraft configuration during emergency"
    );
    score -= 15;
  }

  // Response timing
  if (data.delayedResponse === true) {
    violations.push(
      "Delayed emergency response detected"
    );
    score -= 10;
  }

  if (violations.length === 0) {
    notes.push(
      "Emergency procedure completed within VirtualDLH SOP standards"
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
