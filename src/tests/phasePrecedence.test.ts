import assert from "node:assert/strict";

import type {
  FlightPhase as StratosFlightPhase
} from "@skyvexsoftware/stratos-sdk";

import {
  FlightPhase,
  PhaseDetector,
  type FlightTelemetry
} from "../evaluation/phaseDetector.js";


const detector =
  new PhaseDetector();


const cruiseTelemetry: FlightTelemetry = {
  altitude: 35000,
  cruiseAltitude: 35000,
  groundSpeed: 450,
  verticalSpeed: 0,
  onGround: false
};


const fallbackPhase =
  null
  ?? detector.detect(
    cruiseTelemetry
  );


assert.equal(
  fallbackPhase,
  FlightPhase.CRUISE,
  "Fallback detector should classify the telemetry as cruise when Stratos phase is unavailable"
);


const authoritativePhase =
  "FINAL" as StratosFlightPhase;


const resolvedPhase =
  authoritativePhase
  ?? detector.detect(
    cruiseTelemetry
  );


assert.equal(
  resolvedPhase,
  authoritativePhase,
  "Stratos current phase must override the fallback detector"
);


assert.notEqual(
  resolvedPhase,
  fallbackPhase,
  "Authoritative Stratos phase must not be replaced by the telemetry fallback"
);


console.log(
  "Stratos phase precedence test passed."
);
