import type {
  FlightTelemetrySample
} from "./flightTelemetryAccumulator.js";

import type {
  FlightLightEvent,
  FlightLightStatus
} from "../evaluation/flightEvaluator.js";


export type FlightPhaseReportKey =
  | "boarding"
  | "pushback"
  | "taxi_to_runway"
  | "takeoff"
  | "cruise"
  | "descent"
  | "landing"
  | "taxi_to_gate"
  | "engine_cutoff";

export interface FlightPhaseReport {
  phase: FlightPhaseReportKey;
  timestamp: string;
  lights: FlightLightStatus;
  engine_running?: boolean;
}

const PHASE_ORDER: FlightPhaseReportKey[] = [
  "boarding",
  "pushback",
  "taxi_to_runway",
  "takeoff",
  "cruise",
  "descent",
  "landing",
  "taxi_to_gate",
  "engine_cutoff"
];


function resolvePhase(
  rawPhase: unknown,
  landed: boolean
): FlightPhaseReportKey | null {

  const phase = String(rawPhase ?? "")
    .toUpperCase()
    .replace(/[-\s]+/g, "_");

  if (["BOARDING", "PREFLIGHT", "PREFLIGHT_CHECKS"].includes(phase)) {
    return "boarding";
  }

  if (["PUSHBACK", "PUSH_BACK"].includes(phase)) {
    return "pushback";
  }

  if (["TAXI_IN", "TAXI_TO_GATE", "TAXIIN"].includes(phase)) {
    return "taxi_to_gate";
  }

  if (["TAXI", "TAXI_OUT", "TAXIOUT"].includes(phase)) {
    return landed ? "taxi_to_gate" : "taxi_to_runway";
  }

  if (["TAKEOFF", "TAKEOFF_ROLL", "INITIAL_CLIMB"].includes(phase)) {
    return "takeoff";
  }

  if (phase === "CRUISE") {
    return "cruise";
  }

  if (["DESCENT", "APPROACH", "FINAL"].includes(phase)) {
    return "descent";
  }

  if (["LANDED", "LANDING", "TOUCHDOWN"].includes(phase)) {
    return "landing";
  }

  return null;
}


/**
 * One final snapshot per operational phase, never one row per telemetry frame.
 * Beacon and strobe state is taken from confirmed light events rather than
 * their instantaneous physical flash cycle.
 *
 * An engine-cutoff report is emitted ONLY if engine-on telemetry was observed,
 * followed by 5 continuous seconds of confirmed engine-off while on ground
 * after landing. Deboarding by itself does not establish engine cutoff.
 */
export function buildFlightPhaseReports(
  history: FlightTelemetrySample[],
  lightEvents: FlightLightEvent[]
): FlightPhaseReport[] {

  const reports = new Map<FlightPhaseReportKey, FlightPhaseReport>();
  const knownLights: FlightLightStatus = {};
  const sortedEvents = [...lightEvents].sort(
    (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp)
  );

  let nextEvent = 0;
  let landed = false;
  let enginesWereRunning = false;
  let engineOffSince: number | null = null;

  for (const sample of history) {

    const time = Date.parse(sample.timestamp);

    if (!Number.isFinite(time)) {
      continue;
    }

    while (
      nextEvent < sortedEvents.length &&
      Date.parse(sortedEvents[nextEvent].timestamp) <= time
    ) {

      const event = sortedEvents[nextEvent++];
      const value = event.state === "ON";

      if (event.light === "BEACON") knownLights.beacon = value;
      if (event.light === "STROBE") knownLights.strobe = value;
      if (event.light === "LANDING") knownLights.landing = value;
      if (event.light === "TAXI") knownLights.taxi = value;
      if (event.light === "NAVIGATION") knownLights.navigation = value;
    }

    const phase = String(sample.phase ?? "").toUpperCase();
    if (["LANDED", "LANDING", "TOUCHDOWN", "TAXI_IN"].includes(phase)) {
      landed = true;
    }

    const operationalPhase = resolvePhase(sample.phase, landed);
    const engineRunning = sample.telemetry.engine_running;

    if (engineRunning === true) {
      enginesWereRunning = true;
    }

    if (operationalPhase !== null) {
      reports.set(operationalPhase, {
        phase: operationalPhase,
        timestamp: sample.timestamp,
        lights: { ...knownLights },
        ...(typeof engineRunning === "boolean"
          ? { engine_running: engineRunning }
          : {})
      });
    }

    if (
      landed &&
      sample.telemetry.on_ground === true &&
      enginesWereRunning &&
      engineRunning === false
    ) {
      if (engineOffSince === null) {
        engineOffSince = time;
      }

      if (
        time - engineOffSince >= 5000 &&
        !reports.has("engine_cutoff")
      ) {
        reports.set("engine_cutoff", {
          phase: "engine_cutoff",
          timestamp: sample.timestamp,
          lights: { ...knownLights },
          engine_running: false
        });
      }
    } else if (!reports.has("engine_cutoff")) {
      engineOffSince = null;
    }
  }

  return PHASE_ORDER
    .filter(phase => reports.has(phase))
    .map(phase => reports.get(phase)!);
}
