import type {
  FlightPhase
} from "@skyvexsoftware/stratos-sdk";

import type {
  StratosTelemetry
} from "./telemetryAdapter.js";


export interface FlightTelemetrySample {

  timestamp: string;

  phase:
    FlightPhase | null;

  telemetry:
    StratosTelemetry;

}


export class FlightTelemetryAccumulator {

  private samples:
    FlightTelemetrySample[] = [];

  private lastRecordedAt = 0;

  private readonly minimumIntervalMs:
    number;

  private readonly maxSamples:
    number;


  constructor(
    minimumIntervalMs = 1000,
    maxSamples = 43200
  ) {

    this.minimumIntervalMs =
      minimumIntervalMs;

    this.maxSamples =
      maxSamples;

  }


  record(
    telemetry: StratosTelemetry,
    phase: FlightPhase | null,
    now = Date.now()
  ) {

    if (
      this.lastRecordedAt > 0 &&
      now - this.lastRecordedAt <
        this.minimumIntervalMs
    ) {

      return false;

    }


    this.samples.push({

      timestamp:
        new Date(now).toISOString(),

      phase,

      telemetry: {
        ...telemetry
      }

    });


    this.lastRecordedAt =
      now;


    if (
      this.samples.length >
      this.maxSamples
    ) {

      this.samples.splice(
        0,
        this.samples.length -
          this.maxSamples
      );

    }


    return true;

  }


  getSamples() {

    return [
      ...this.samples
    ];

  }


  getSamplesByPhase(
    phase: FlightPhase
  ) {

    return this.samples.filter(
      sample =>
        sample.phase === phase
    );

  }


  getSampleCount() {

    return this.samples.length;

  }


  getFirstSample() {

    return this.samples[0]
      ?? null;

  }


  getLatestSample() {

    return this.samples[
      this.samples.length - 1
    ] ?? null;

  }


  clear() {

    this.samples = [];

    this.lastRecordedAt = 0;

  }

}
