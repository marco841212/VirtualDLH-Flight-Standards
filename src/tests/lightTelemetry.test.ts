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


// Confirm the departure-to-climb landing-light OFF state with a
// second stable sample (short single-frame glitches are ignored).
telemetryHistory.push({
  ...telemetryHistory[1],
  timestamp: "2026-09-22T12:02:03.000Z"
});


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


// Regression: pulsing beacon/strobe telemetry must not generate
// thousands of ON/OFF actions during a long flight.
const flickerHistory = Array.from(
  { length: 180 },
  (_, second) => ({
    timestamp: new Date(
      Date.UTC(2026, 9, 11, 0, 0, second)
    ).toISOString(),
    phase: "CRUISE",
    telemetry: {
      altitude: 35000,
      altitude_agl: 35000,
      ground_speed: 450,
      indicated_airspeed: 280,
      vertical_speed: 0,
      on_ground: false,
      beacon_light:
        second >= 120 && second < 139
          ? false
          : second % 2 === 0,
      strobe_light:
        second >= 120 && second < 139
          ? false
          : second % 3 === 0,
      landing_lights: second >= 139,
      taxi_light: false,
      nav_light: true
    }
  })
) as any;


const filtered = evaluator.evaluate(
  {
    altitude: 35000,
    altitudeAgl: 35000,
    groundSpeed: 450,
    indicatedAirspeed: 280,
    verticalSpeed: 0,
    onGround: false,
    beaconLight: false,
    strobeLight: false,
    landingLights: true,
    taxiLight: false,
    navLight: true
  },
  undefined,
  [],
  flickerHistory,
  "CRUISE" as any
);


assert.deepEqual(
  filtered.lightEvents
    .filter(event => event.light === "BEACON")
    .map(event => event.state),
  ["ON", "OFF", "ON"]
);


assert.deepEqual(
  filtered.lightEvents
    .filter(event => event.light === "STROBE")
    .map(event => event.state),
  ["ON", "OFF", "ON"]
);


assert.deepEqual(
  filtered.lightEvents
    .filter(event => event.light === "LANDING")
    .map(event => event.state),
  ["OFF", "ON"]
);


assert.ok(
  filtered.lightEvents.length <= 12,
  "Pulsing lights should not flood the event history"
);


// The last raw beacon frame is OFF, but its stable state is ON.
assert.equal(filtered.lightStatus.beacon, true);
assert.equal(filtered.lightStatus.strobe, true);
