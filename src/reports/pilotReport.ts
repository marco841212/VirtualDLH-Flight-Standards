export interface PilotFlightReport {
  pilot: string;
  aircraft: string;
  route: string;
  score: number;
  grade: string;
  strengths: string[];
  improvements: string[];
}

export class PilotReportGenerator {

  generate(data: PilotFlightReport) {

    return {
      title: "VirtualDLH Flight Standards Report",

      pilot: data.pilot,

      aircraft: data.aircraft,

      route: data.route,

      finalScore: `${data.score}/100`,

      grade: data.grade,

      strengths: data.strengths,

      improvements: data.improvements,

      generatedAt: new Date().toISOString()
    };

  }

}