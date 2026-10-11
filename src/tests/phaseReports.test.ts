import assert from "node:assert/strict";

import {
  buildFlightPhaseReports
} from "../stratos/flightPhaseReports.js";


const start = Date.UTC(2026, 9, 11, 12, 0, 0);
const sample = (
  seconds: number,
  phase: string,
  engineRunning: boolean | undefined
) => ({
  timestamp: new Date(start + seconds * 1000).toISOString(),
  phase,
  telemetry: {
    on_ground: !["TAKEOFF", "CRUISE", "DESCENT", "FINAL"].includes(phase),
    engine_running: engineRunning
  }
});

const history = [
  sample(0, "BOARDING", false),
  sample(10, "PUSH_BACK", true),
  sample(20, "TAXI", true),
  sample(30, "TAKEOFF", true),
  sample(40, "CRUISE", true),
  sample(50, "DESCENT", true),
  sample(60, "FINAL", true),
  sample(70, "LANDED", true),
  sample(80, "TAXI_IN", true),
  sample(90, "TAXI_IN", false),
  sample(94, "DEBOARDING", false),
  sample(95, "DEBOARDING", false),
  sample(96, "DEBOARDING", false)
] as any;

const lightEvents = [
  {
    light: "BEACON",
    state: "OFF",
    timestamp: new Date(start).toISOString(),
    phase: "BOARDING"
  },
  {
    light: "NAVIGATION",
    state: "ON",
    timestamp: new Date(start).toISOString(),
    phase: "BOARDING"
  },
  {
    light: "BEACON",
    state: "ON",
    timestamp: new Date(start + 10_000).toISOString(),
    phase: "PUSH_BACK"
  }
] as any;

const reports = buildFlightPhaseReports(history, lightEvents);
assert.deepEqual(
  reports.map(report => report.phase),
  [
    "boarding",
    "pushback",
    "taxi_to_runway",
    "takeoff",
    "cruise",
    "descent",
    "landing",
    "taxi_to_gate",
    "engine_cutoff"
  ],
  "Exactly one ordered report per operational phase"
);

assert.equal(reports.length, 9);
assert.equal(reports[1].lights.beacon, true);
assert.equal(reports[5].lights.navigation, true);
assert.equal(reports[8].engine_running, false);
assert.equal(reports[8].timestamp, new Date(start + 95_000).toISOString());

// Deboarding does NOT imply engine cutoff when simulator engine telemetry
// is unavailable or does not document a real ON-to-OFF transition.
const missingEngineInfo = [
  sample(0, "BOARDING", undefined),
  sample(10, "TAKEOFF", undefined),
  sample(20, "LANDED", undefined),
  sample(30, "DEBOARDING", undefined),
  sample(40, "DEBOARDING", undefined)
] as any;

assert.equal(
  buildFlightPhaseReports(missingEngineInfo, []).some(
    report => report.phase === "engine_cutoff"
  ),
  false
);

console.log("One-report-per-phase tests passed");
