export interface PilotReportData {

  pilotName: string;

  flightNumber: string;

  aircraft: string;

  route: string;

  score: number;

  rating: string;

  trainingRequired: boolean;

  sopPhases: Record<string, number>;

  exceedances: string[];

  recommendations: string[];

}



export class PilotReportGenerator {


  generate(
    data: PilotReportData
  ): string {


    let report = "";



    report += "VirtualDLH Flight Performance Report\n";

    report += "=================================\n\n";


    report += `Pilot: ${data.pilotName}\n`;

    report += `Flight: ${data.flightNumber}\n`;

    report += `Aircraft: ${data.aircraft}\n`;

    report += `Route: ${data.route}\n\n`;



    report += `Overall Score: ${data.score}%\n`;

    report += `Rating: ${data.rating}\n\n`;



    report += "SOP Performance:\n";

    report += "----------------\n";


    for (
      const phase in data.sopPhases
    ) {

      report +=
        `${phase}: ${data.sopPhases[phase]}%\n`;

    }



    report += "\nFOQA Findings:\n";

    report += "--------------\n";


    if (
      data.exceedances.length === 0
    ) {

      report +=
        "No operational exceedances detected.\n";

    }

    else {

      for (
        const event of data.exceedances
      ) {

        report +=
          `- ${event}\n`;

      }

    }



    report += "\nTraining Recommendations:\n";

    report += "-------------------------\n";


    if (
      data.recommendations.length === 0
    ) {

      report +=
        "No additional training required.\n";

    }

    else {

      for (
        const item of data.recommendations
      ) {

        report +=
          `- ${item}\n`;

      }

    }



    report += "\nFinal Status:\n";

    report += "-------------\n";


    report +=
      data.trainingRequired
        ? "TRAINING REVIEW REQUIRED\n"
        : "FLIGHT STANDARDS PASSED\n";


    return report;

  }

}
