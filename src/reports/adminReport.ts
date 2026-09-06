export interface AdminFlightReport {
  pilot: string;
  aircraft: string;
  flight: string;
  score: number;
  violations: string[];
  recommendation: string;
}

export class AdminReportGenerator {

  generate(data: AdminFlightReport) {

    return {

      title: "VirtualDLH Operations Report",

      pilot: data.pilot,

      aircraft: data.aircraft,

      flight: data.flight,

      score: `${data.score}/100`,

      violations: data.violations,

      trainingRecommendation:
        data.recommendation,

      generatedAt:
        new Date().toISOString()

    };

  }

}