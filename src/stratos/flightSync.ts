import type { LandingAnalysis } from "@skyvexsoftware/stratos-sdk";

import { FlightEvaluator } from "../evaluation/flightEvaluator.js";

import {
  TelemetryAdapter,
  StratosTelemetry
} from "./telemetryAdapter.js";

import type {
  FlightPhaseStatistics
} from "./flightPhaseAnalyzer.js";

import type {
  FlightTelemetrySample
} from "./flightTelemetryAccumulator.js";


export class FlightSync {

  private evaluator:
    FlightEvaluator;

  private adapter:
    TelemetryAdapter;


  constructor() {

    this.evaluator =
      new FlightEvaluator();

    this.adapter =
      new TelemetryAdapter();

  }


  async processFlight(
    flightId: string,
    telemetry?: StratosTelemetry,
    landingAnalysis?: LandingAnalysis,
    phaseStatistics: FlightPhaseStatistics[] = [],
    telemetryHistory: FlightTelemetrySample[] = []
  ) {

    if (!telemetry) {

      throw new Error(
        `No live telemetry available for flight ${flightId}`
      );

    }


    const flightTelemetry =
      this.adapter.convert(
        telemetry
      );


    const evaluation =
      this.evaluator.evaluate(
        flightTelemetry,
        landingAnalysis,
        phaseStatistics,
        telemetryHistory
      );


    return {

      flightId,

      telemetry:
        flightTelemetry,

      evaluation

    };

  }


  async completeFlight(
    flightId: string
  ) {

    return {

      success: true,

      flightId

    };

  }

}
