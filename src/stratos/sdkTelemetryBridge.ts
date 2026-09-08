import type {
  FlightData,
  FlightPhase,
  LandingAnalysis,
  PluginFlightAccessor,
  SimDataSnapshot
} from "@skyvexsoftware/stratos-sdk";

import type {
  StratosTelemetry
} from "./telemetryAdapter.js";

import {
  FlightTelemetryAccumulator
} from "./flightTelemetryAccumulator.js";

import {
  FlightPhaseAnalyzer
} from "./flightPhaseAnalyzer.js";


export class StratosSdkTelemetryBridge {

  private flight:
    PluginFlightAccessor;

  private latestTelemetry:
    StratosTelemetry | null = null;

  private currentPhase:
    FlightPhase | null = null;

  private latestLandingAnalysis:
    LandingAnalysis | null = null;

  private accumulator:
    FlightTelemetryAccumulator;

  private phaseAnalyzer:
    FlightPhaseAnalyzer;

  private unsubscribeSimData:
    (() => void) | null = null;

  private unsubscribePhase:
    (() => void) | null = null;

  private unsubscribeLanding:
    (() => void) | null = null;


  constructor(
    flight: PluginFlightAccessor
  ) {

    this.flight =
      flight;

    this.accumulator =
      new FlightTelemetryAccumulator();

    this.phaseAnalyzer =
      new FlightPhaseAnalyzer();

  }


  async start() {

    /*
     * Hydrate the authoritative Stratos phase.
     */
    const phaseSnapshot =
      await this.flight.getPhase();

    this.currentPhase =
      phaseSnapshot.currentPhase;


    const landingSnapshot =
      await this.flight.getLandingReport();

    this.latestLandingAnalysis =
      landingSnapshot.landingAnalysis;


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


    this.unsubscribeLanding =
      this.flight.onLanding(
        payload => {

          if (payload.landingAnalysis) {

            this.latestLandingAnalysis =
              payload.landingAnalysis;

          }

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


    if (this.unsubscribeLanding) {

      this.unsubscribeLanding();

      this.unsubscribeLanding =
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


  getLandingAnalysis():
    LandingAnalysis | null {

    return this.latestLandingAnalysis;

  }


  hasLandingAnalysis() {

    return (
      this.latestLandingAnalysis !== null
    );

  }


  getTelemetryHistory() {

    return this.accumulator
      .getSamples();

  }


  getTelemetrySampleCount() {

    return this.accumulator
      .getSampleCount();

  }


  getPhaseStatistics() {

    return this.phaseAnalyzer
      .analyze(
        this.accumulator
          .getSamples()
      );

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


  clearLandingAnalysis() {

    this.latestLandingAnalysis =
      null;

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

      altitude_agl:
        data.altitudeAgl,

      cruise_altitude:
        data.cruiseAltitude,

      ground_speed:
        data.groundSpeed,

      indicated_airspeed:
        data.indicatedAirspeed,

      vertical_speed:
        data.verticalSpeed,

      bank_angle:
        data.bank,

      pitch:
        data.pitch,

      on_ground:
        data.planeOnground,

      gear_down:
        data.gearControl,

      flaps_extended:
        (
          data.flapsControl > 0 ||
          data.flapsLeftPosition > 0 ||
          data.flapsRightPosition > 0
        ),

      overspeed_warning:
        data.overspeedWarning,

      stall_warning:
        data.stallWarning,

      crashed:
        data.crashed,

      landing_rate:
        data.landingRate,

      landing_distance:
        data.landingDistance,

      glideslope_deviation:
        data.glideslopeDeviation,

      localizer_deviation:
        data.localizerDeviation,

      reverser_1_deployed:
        data.reverser1Deployed,

      reverser_2_deployed:
        data.reverser2Deployed,

      autobrake_position:
        data.autobrakePosition,

      speedbrake_position:
        data.speedbrakePosition

    };

  }

}
