import assert from "node:assert/strict";

import {
  FlightEvaluator
} from "../evaluation/flightEvaluator.js";


const evaluator =
  new FlightEvaluator();


const telemetryHistory = [
  {
    timestamp:
      "2026-09-22T12:00:00.000Z",
    phase:
      "TAKEOFF",
    telemetry: {
      altitude:
        100,
      altitude_agl:
        100,
      ground_speed:
        90,
      indicated_airspeed:
        125,
      vertical_speed:
        850,
      on_ground:
        false,
      beacon_light:
        true,
      strobe_light:
        true,
      landing_lights:
        true,
      taxi_light:
        false,
      nav_light:
        true
    }
  },
  {
    timestamp:
      "2026-09-22T12:02:00.000Z",
    phase:
      "CLIMB",
    telemetry: {
      altitude:
        12000,
      altitude_agl:
        11500,
      ground_speed:
        280,
      indicated_airspeed:
        250,
      vertical_speed:
        1500,
      on_ground:
        false,
      beacon_light:
        true,
      strobe_light:
        true,
      landing_lights:
        false,
      taxi_light:
        false,
      nav_light:
        true
    }
  }
] as any;


const evaluation =
  evaluator.evaluate(
    {
      altitude:
        12000,
      altitudeAgl:
        11500,
      groundSpeed:
        280,
      indicatedAirspeed:
        250,
      verticalSpeed:
        1500,
      onGround:
        false,
      beaconLight:
        true,
      strobeLight:
        true,
      landingLights:
        false,
      taxiLight:
        false,
      navLight:
        true
    },
    undefined,
    [],
    telemetryHistory,
    "CLIMB" as any
  );


assert.equal(
  evaluation.lightTelemetryAvailable,
  true
);

assert.equal(
  evaluation.takeoffScore,
  100
);

assert.equal(
  evaluation.lightStatus.beacon,
  true
);

assert.equal(
  evaluation.lightStatus.landing,
  false
);

assert.ok(
  evaluation.lightEvents.some(
    event =>
      event.light === "LANDING" &&
      event.state === "ON"
  )
);

assert.ok(
  evaluation.lightEvents.some(
    event =>
      event.light === "LANDING" &&
      event.state === "OFF"
  )
);


console.log(
  "Light telemetry test passed"
);
