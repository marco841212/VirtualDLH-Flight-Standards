import type { LandingAnalysis } from "@skyvexsoftware/stratos-sdk";

import { LiveMonitor } from "../stratos/liveMonitor.js";
import { PilotReportGenerator } from "../reports/pilotReport.js";

import type {
  StratosTelemetry
} from "../stratos/telemetryAdapter.js";

import type {
  FlightPhaseStatistics
} from "../stratos/flightPhaseAnalyzer.js";


export interface StandardsFlightRequest {

  flightId: string;

  pilotName?: string;

  flightNumber?: string;

  aircraft?: string;

  route?: string;

}


export class StandardsController {

  private liveMonitor:
    LiveMonitor;

  private reportGenerator:
    PilotReportGenerator;


  constructor() {

    this.liveMonitor =
      new LiveMonitor();

    this.reportGenerator =
      new PilotReportGenerator();

  }


  async evaluateFlight(
    request: StandardsFlightRequest,
    telemetry?: StratosTelemetry,
    landingAnalysis?: LandingAnalysis,
    phaseStatistics: FlightPhaseStatistics[] = []
  ) {

    const result =
      await this.liveMonitor.monitorFlight(
        request.flightId,
        telemetry,
        landingAnalysis
      );


    if (!result.success) {

      return {

        success: false,

        error:
          result.error

      };

    }


    const evaluation =
      result.evaluation as any;


    const phaseReport =
      Object.fromEntries(
        phaseStatistics.map(
          item => [item.phase, item]
        )
      );


    const enrichedEvaluation = {
      ...evaluation,
      phaseStatistics,
      phaseScores: phaseReport
    };


    const report =
      this.reportGenerator.generate({

        pilot:
          request.pilotName
          ?? "Unknown Pilot",

        flightNumber:
          request.flightNumber
          ?? request.flightId,

        aircraft:
          request.aircraft
          ?? "Unknown Aircraft",

        route:
          request.route
          ?? "Unknown Route",

        score:
          evaluation.score
          ?? 0,

        rating:
          evaluation.rating
          ?? "PENDING",

        trainingRequired:
          evaluation.trainingRequired
          ?? false,

        sopPhases:
          phaseReport,

        exceedances:
          evaluation.exceedances
          ?? [],

        recommendations:
          evaluation.recommendations
          ?? []

      });


    return {

      success: true,

      flightId:
        request.flightId,

      evaluation:
        enrichedEvaluation,

      report

    };

  }

}
