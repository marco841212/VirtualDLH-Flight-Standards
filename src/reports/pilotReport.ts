export interface PilotFlightReport {
  pilot: string;
  flightNumber?: string;
  aircraft: string;
  route: string;
  score: number;
  evaluationComplete?: boolean;
  rating?: string;
  trainingRequired?: boolean;
  sopPhases?: Record<string, unknown>;
  exceedances?: unknown[];
  recommendations?: unknown[];
}

export class PilotReportGenerator {

  generate(data: PilotFlightReport) {

    const evaluationComplete =
      data.evaluationComplete === true;

    const grade =
      evaluationComplete === false
        ? "PENDING"
        : data.score >= 95 ? "A" :
          data.score >= 90 ? "B" :
          data.score >= 80 ? "C" :
          data.score >= 70 ? "D" :
          "F";

    const status =
      evaluationComplete === false
        ? "INCOMPLETE"
        : data.trainingRequired === true
          ? "TRAINING REQUIRED"
          : data.score >= 80
            ? "PASS"
            : "TRAINING REQUIRED";

    return {
      title: "VirtualDLH Flight Standards Report",

      pilot: data.pilot,

      flightNumber: data.flightNumber,

      aircraft: data.aircraft,

      route: data.route,

      finalScore:
        evaluationComplete
          ? data.score + "/100"
          : "PENDING",

      provisionalScore:
        evaluationComplete
          ? undefined
          : data.score,

      evaluationComplete,

      score: data.score,

      grade,

      rating:
        evaluationComplete
          ? data.rating ?? "PENDING"
          : "PENDING",

      status,

      trainingRequired:
        evaluationComplete
          ? data.trainingRequired ?? data.score < 80
          : false,

      sopPhases:
        data.sopPhases ?? {},

      exceedances:
        data.exceedances ?? [],

      recommendations:
        data.recommendations ?? [],

      generatedAt:
        new Date().toISOString()
    };

  }

}
