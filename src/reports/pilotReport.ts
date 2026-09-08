export interface PilotFlightReport {
  pilot: string;
  flightNumber?: string;
  aircraft: string;
  route: string;
  score: number;
  rating?: string;
  trainingRequired?: boolean;
  sopPhases?: Record<string, unknown>;
  exceedances?: unknown[];
  recommendations?: unknown[];
}

export class PilotReportGenerator {

  generate(data: PilotFlightReport) {

    const grade =
      data.score >= 95 ? "A" :
      data.score >= 90 ? "B" :
      data.score >= 80 ? "C" :
      data.score >= 70 ? "D" :
      "F";

    const status =
      data.trainingRequired === true
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

      finalScore: `${data.score}/100`,

      score: data.score,

      grade,

      rating: data.rating ?? "PENDING",

      status,

      trainingRequired:
        data.trainingRequired ?? data.score < 80,

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
