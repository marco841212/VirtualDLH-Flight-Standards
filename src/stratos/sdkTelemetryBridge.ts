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


type UnknownRecord =
  Record<string, unknown>;


export interface LightTelemetryDiagnostics {

  topLevelKeys:
    string[];

  lightLikeKeys:
    string[];

  nestedLightKeys:
    Record<string, string[]>;

}


function buildLightTelemetryDiagnostics(
  data: FlightData
): LightTelemetryDiagnostics {

  const source =
    data as unknown as UnknownRecord;

  const topLevelKeys =
    Object.keys(source).sort();

  const lightLikeKeys =
    topLevelKeys.filter(
      key =>
        /light|beacon|strobe|taxi|nav/i.test(
          key
        )
    );

  const nestedLightKeys:
    Record<string, string[]> = {};


  for (
    const key of [
      "lights",
      "lightStates",
      "aircraftLights"
    ]
  ) {

    const value =
      source[key];

    if (
      typeof value !== "object" ||
      value === null ||
      Array.isArray(value)
    ) {

      continue;

    }

    nestedLightKeys[key] =
      Object.keys(
        value as UnknownRecord
      ).sort();

  }


  return {
    topLevelKeys,
    lightLikeKeys,
    nestedLightKeys
  };

}


function toOptionalBoolean(
  value: unknown
): boolean | undefined {

  if (typeof value === "boolean") {

    return value;

  }


  if (typeof value === "number") {

    if (!Number.isFinite(value)) {

      return undefined;

    }

    return value !== 0;

  }


  if (typeof value === "string") {

    const normalized =
      value.trim().toLowerCase();

    if (
      normalized === "true" ||
      normalized === "on" ||
      normalized === "1" ||
      normalized === "yes"
    ) {

      return true;

    }

    if (
      normalized === "false" ||
      normalized === "off" ||
      normalized === "0" ||
      normalized === "no"
    ) {

      return false;

    }

  }


  return undefined;

}


function readBooleanField(
  source: UnknownRecord,
  keys: string[]
): boolean | undefined {

  for (const key of keys) {

    if (!(key in source)) {

      continue;

    }

    const value =
      toOptionalBoolean(
        source[key]
      );

    if (value !== undefined) {

      return value;

    }

  }


  return undefined;

}


function readLightState(
  data: FlightData,
  directKeys: string[],
  nestedKeys: string[]
): boolean | undefined {

  const source =
    data as unknown as UnknownRecord;


  const direct =
    readBooleanField(
      source,
      directKeys
    );

  if (direct !== undefined) {

    return direct;

  }


  const nestedCandidates = [
    source.lights,
    source.lightStates,
    source.aircraftLights
  ];


  for (const candidate of nestedCandidates) {

    if (
      typeof candidate !== "object" ||
      candidate === null ||
      Array.isArray(candidate)
    ) {

      continue;

    }


    const nested =
      readBooleanField(
        candidate as UnknownRecord,
        nestedKeys
      );

    if (nested !== undefined) {

      return nested;

    }

  }


  return undefined;

}


function readEngineRunning(
  data: FlightData
): boolean | undefined {

  const source = data as unknown as UnknownRecord;
  const count = source.enginesCount;

  if (
    typeof count !== "number" ||
    !Number.isInteger(count) ||
    count < 1 || count > 4
  ) {
    return undefined;
  }

  const states = Array.from({ length: count }, (_, index) =>
    readBooleanField(source, [
      `engine${index + 1}On`,
      `engine${index + 1}Firing`
    ])
  );

  // Never interpret absent engine telemetry as an engine shutdown.
  if (states.some(state => state === undefined)) {
    return undefined;
  }

  return states.some(state => state === true);
}


export class StratosSdkTelemetryBridge {

  private flight:
    PluginFlightAccessor;

  private latestTelemetry:
    StratosTelemetry | null = null;

  private currentPhase:
    FlightPhase | null = null;

  private latestLandingAnalysis:
    LandingAnalysis | null = null;


  private lightTelemetryDiagnostics:
    LightTelemetryDiagnostics | null = null;

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


  getLightTelemetryDiagnostics():
    LightTelemetryDiagnostics | null {

    return this.lightTelemetryDiagnostics;

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


    const diagnostics =
      buildLightTelemetryDiagnostics(
        snapshot.data
      );


    if (
      !this.lightTelemetryDiagnostics ||
      diagnostics.lightLikeKeys.length >
        this.lightTelemetryDiagnostics
          .lightLikeKeys.length
    ) {

      this.lightTelemetryDiagnostics =
        diagnostics;

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
        data.speedbrakePosition,

      beacon_light:
        readLightState(
          data,
          [
            "beaconLight",
            "beaconLights",
            "lightBeacon",
            "lightsBeacon",
            "beacon",
            "beacon_light",
            "light_beacon"
          ],
          [
            "beacon",
            "beaconLight",
            "beaconLights",
            "beacon_light"
          ]
        ),

      strobe_light:
        readLightState(
          data,
          [
            "strobeLight",
            "strobeLights",
            "lightStrobe",
            "lightsStrobe",
            "strobe",
            "strobe_light",
            "light_strobe"
          ],
          [
            "strobe",
            "strobeLight",
            "strobeLights",
            "strobe_light"
          ]
        ),

      landing_lights:
        readLightState(
          data,
          [
            "landingLight",
            "landingLights",
            "lightLanding",
            "lightsLanding",
            "landing_light",
            "landing_lights",
            "light_landing"
          ],
          [
            "landing",
            "landingLight",
            "landingLights",
            "landing_light",
            "landing_lights"
          ]
        ),

      taxi_light:
        readLightState(
          data,
          [
            "taxiLight",
            "taxiLights",
            "lightTaxi",
            "lightsTaxi",
            "taxi_light",
            "taxi_lights",
            "light_taxi"
          ],
          [
            "taxi",
            "taxiLight",
            "taxiLights",
            "taxi_light",
            "taxi_lights"
          ]
        ),

      nav_light:
        readLightState(
          data,
          [
            "navLight",
            "navLights",
            "navigationLight",
            "navigationLights",
            "lightNav",
            "lightsNav",
            "nav_light",
            "nav_lights",
            "navigation_light",
            "navigation_lights"
          ],
          [
            "nav",
            "navigation",
            "navLight",
            "navLights",
            "navigationLight",
            "navigationLights",
            "nav_light",
            "navigation_light"
          ]
        ),

      engine_running:
        readEngineRunning(data)

    };

  }

}
