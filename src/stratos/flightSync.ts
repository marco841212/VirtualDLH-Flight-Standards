import type { LandingAnalysis } from "@skyvexsoftware/stratos-sdk";

import { FlightEvaluator } from "../evaluation/flightEvaluator.js";

import {
  TelemetryAdapter,
  StratosTelemetry
} from "./telemetryAdapter.js";

import type {
  FlightPhaseStatistics
} from "./flightPhaseAnalyzer.js";


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
    phaseStatistics: FlightPhaseStatistics[] = []
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
        phaseStatistics
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
