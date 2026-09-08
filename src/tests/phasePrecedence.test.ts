import assert from "node:assert/strict";

import {
  FlightPhase as StratosFlightPhase
} from "@skyvexsoftware/stratos-sdk";

import {
  FlightEvaluator
} from "../evaluation/flightEvaluator.js";

import {
  FlightPhase,
  type FlightTelemetry
} from "../evaluation/phaseDetector.js";


const evaluator =
  new FlightEvaluator();


const cruiseTelemetry: FlightTelemetry = {
  altitude: 35000,
  cruiseAltitude: 35000,
  groundSpeed: 450,
  verticalSpeed: 0,
  onGround: false
};


const fallbackEvaluation =
  evaluator.evaluate(
    cruiseTelemetry
  );


assert.equal(
  fallbackEvaluation.phase,
  FlightPhase.CRUISE,
  "Fallback detector should classify the telemetry as cruise when Stratos phase is unavailable"
);


const authoritativeEvaluation =
  evaluator.evaluate(
    cruiseTelemetry,
    undefined,
    [],
    [],
    StratosFlightPhase.FINAL
  );


assert.equal(
  authoritativeEvaluation.phase,
  StratosFlightPhase.FINAL,
  "Stratos current phase must override the fallback detector"
);


assert.notEqual(
  authoritativeEvaluation.phase,
  fallbackEvaluation.phase,
  "Authoritative Stratos phase must not be replaced by the telemetry fallback"
);


console.log(
  "Stratos phase precedence test passed."
);
