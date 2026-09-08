import type {
  FlightData,
  FlightPhase,
  PluginFlightAccessor,
  SimDataSnapshot
} from "@skyvexsoftware/stratos-sdk";

import type {
  StratosTelemetry
} from "./telemetryAdapter.js";

import {
  FlightTelemetryAccumulator
} from "./flightTelemetryAccumulator.js";


export class StratosSdkTelemetryBridge {

  private flight:
    PluginFlightAccessor;

  private latestTelemetry:
    StratosTelemetry | null = null;

  private currentPhase:
    FlightPhase | null = null;

  private accumulator:
    FlightTelemetryAccumulator;

  private unsubscribeSimData:
    (() => void) | null = null;

  private unsubscribePhase:
    (() => void) | null = null;


  constructor(
    flight: PluginFlightAccessor
  ) {

    this.flight =
      flight;

    this.accumulator =
      new FlightTelemetryAccumulator();

  }


  async start() {

    /*
     * Hydrate the authoritative Stratos phase.
     */
    const phaseSnapshot =
      await this.flight.getPhase();

    this.currentPhase =
      phaseSnapshot.currentPhase;


    /*
     * Subscribe to future Stratos phase changes.
     */
    this.unsubscribePhase =
      this.flight.onPhaseChange(
        payload => {

          this.currentPhase =
            payload.currentPhase;

        }
      );


    /*
     * Hydrate current simulator data.
     */
    const snapshot =
      await this.flight.getSnapshot();

    if (snapshot) {

      this.capture(
        snapshot
      );

    }


    /*
     * Subscribe to live simulator frames.
     */
    this.unsubscribeSimData =
      this.flight.onSimData(
        snapshot => {

          this.capture(
            snapshot
          );

        }
      );

  }


  stop() {

    if (this.unsubscribeSimData) {

      this.unsubscribeSimData();

      this.unsubscribeSimData =
        null;

    }


    if (this.unsubscribePhase) {

      this.unsubscribePhase();

      this.unsubscribePhase =
        null;

    }

  }


  getLatestTelemetry():
    StratosTelemetry | null {

    return this.latestTelemetry;

  }


  getCurrentPhase():
    FlightPhase | null {

    return this.currentPhase;

  }


  getTelemetryHistory() {

    return this.accumulator
      .getSamples();

  }


  getTelemetrySampleCount() {

    return this.accumulator
      .getSampleCount();

  }


  getTelemetryHistoryByPhase(
    phase: FlightPhase
  ) {

    return this.accumulator
      .getSamplesByPhase(
        phase
      );

  }


  clearTelemetryHistory() {

    this.accumulator.clear();

  }


  hasLiveTelemetry() {

    return (
      this.latestTelemetry !== null
    );

  }


  private capture(
    snapshot: SimDataSnapshot
  ) {

    if (
      !snapshot.isConnected ||
      !snapshot.data
    ) {

      return;

    }


    const telemetry =
      this.convertFlightData(
        snapshot.data
      );


    this.latestTelemetry =
      telemetry;


    this.accumulator.record(
      telemetry,
      this.currentPhase
    );

  }


  private convertFlightData(
    data: FlightData
  ): StratosTelemetry {

    return {

      altitude:
        data.altitude,

      ground_speed:
        data.groundSpeed,

      vertical_speed:
        data.verticalSpeed,

      on_ground:
        data.planeOnground,

      gear_down:
        data.gearControl,

      flaps_extended:
        (
          data.flapsControl > 0 ||
          data.flapsLeftPosition > 0 ||
          data.flapsRightPosition > 0
        )

    };

  }

}
