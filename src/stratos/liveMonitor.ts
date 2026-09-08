import type { LandingAnalysis } from "@skyvexsoftware/stratos-sdk";

import { FlightSync } from "./flightSync.js";

import type {
  StratosTelemetry
} from "./telemetryAdapter.js";


export interface MonitorResult {

  success: boolean;

  flightId: string;

  evaluation?: unknown;

  error?: string;

}


export class LiveMonitor {

  private flightSync:
    FlightSync;


  constructor() {

    this.flightSync =
      new FlightSync();

  }


  async monitorFlight(
    flightId: string,
    telemetry?: StratosTelemetry,
    landingAnalysis?: LandingAnalysis
  ): Promise<MonitorResult> {

    try {

      const result =
        await this.flightSync.processFlight(
          flightId,
          telemetry,
          landingAnalysis
        );


      return {

        success: true,

        flightId,

        evaluation:
          result.evaluation

      };


    } catch (error) {

      return {

        success: false,

        flightId,

        error:
          error instanceof Error
            ? error.message
            : "Unknown error"

      };

    }

  }

}
