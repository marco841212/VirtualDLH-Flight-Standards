import { LiveMonitor } from "../stratos/liveMonitor.js";
import { PilotReportGenerator } from "../reports/pilotReport.js";


export interface StandardsFlightRequest {

  flightId: string;

  pilotName?: string;

  flightNumber?: string;

  aircraft?: string;

  route?: string;

}



export class StandardsController {


  private liveMonitor: LiveMonitor;

  private reportGenerator: PilotReportGenerator;



  constructor() {

    this.liveMonitor = new LiveMonitor();

    this.reportGenerator =
      new PilotReportGenerator();

  }



  async evaluateFlight(
    request: StandardsFlightRequest
  ) {


    const result =
      await this.liveMonitor.monitorFlight(
        request.flightId
      );



    if (!result.success) {

      return {

        success: false,

        error: result.error

      };

    }



    const evaluation =
      result.evaluation as any;



    const report =
      this.reportGenerator.generate({

        pilot:
          request.pilotName ?? "Unknown Pilot",

        flightNumber:
          request.flightNumber ?? request.flightId,

        aircraft:
          request.aircraft ?? "Unknown Aircraft",

        route:
          request.route ?? "Unknown Route",

        score:
          evaluation.score ?? 0,

        rating:
          evaluation.rating ?? "PENDING",

        trainingRequired:
          evaluation.trainingRequired ?? false,

        sopPhases:
          evaluation.phaseScores ?? {},

        exceedances:
          evaluation.exceedances ?? [],

        recommendations:
          evaluation.recommendations ?? []

      });



    return {

      success: true,

      flightId:
        request.flightId,

      evaluation,

      report

    };

  }

}
