import type {
  FlightPhase as StratosFlightPhase,
  LandingAnalysis
} from "@skyvexsoftware/stratos-sdk";

import { FlightSync } from "./flightSync.js";

import type {
  StratosTelemetry
} from "./telemetryAdapter.js";

import type {
  FlightPhaseStatistics
} from "./flightPhaseAnalyzer.js";

import type {
  FlightTelemetrySample
} from "./flightTelemetryAccumulator.js";


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
    landingAnalysis?: LandingAnalysis,
    phaseStatistics: FlightPhaseStatistics[] = [],
    telemetryHistory: FlightTelemetrySample[] = [],
    currentPhase: StratosFlightPhase | null = null
  ): Promise<MonitorResult> {

    try {

      const result =
        await this.flightSync.processFlight(
          flightId,
          telemetry,
          landingAnalysis,
          phaseStatistics,
          telemetryHistory,
          currentPhase
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
