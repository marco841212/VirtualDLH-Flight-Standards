import type {
  StratosTelemetry
} from "./telemetryAdapter.js";


export interface FlightTelemetrySample {

  timestamp: string;

  telemetry: StratosTelemetry;

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
