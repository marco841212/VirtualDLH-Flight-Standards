import assert from "node:assert/strict";

import {
  FlightPhase,
  PhaseDetector,
  type FlightTelemetry
} from "../evaluation/phaseDetector.js";


type PhaseCase = {
  name: string;
  telemetry: FlightTelemetry;
  expected: FlightPhase;
};


const detector =
  new PhaseDetector();


const cases: PhaseCase[] = [
  {
    name: "parked",
    telemetry: {
      altitude: 0,
      groundSpeed: 0,
      verticalSpeed: 0,
      onGround: true
    },
    expected: FlightPhase.PARKED
  },
  {
    name: "taxi out",
    telemetry: {
      altitude: 0,
      groundSpeed: 20,
      verticalSpeed: 0,
      onGround: true
    },
    expected: FlightPhase.TAXI_OUT
  },
  {
    name: "taxi out ignores zero landing placeholders",
    telemetry: {
      altitude: 0,
      groundSpeed: 20,
      verticalSpeed: 0,
      onGround: true,
      landingRate: 0,
      landingDistance: 0,
      reverser1Deployed: false,
      reverser2Deployed: false
    },
    expected: FlightPhase.TAXI_OUT
  },
  {
    name: "takeoff roll",
    telemetry: {
      altitude: 0,
      groundSpeed: 90,
      verticalSpeed: 0,
      onGround: true
    },
    expected: FlightPhase.TAKEOFF_ROLL
  },
  {
    name: "takeoff roll ignores zero landing placeholders",
    telemetry: {
      altitude: 0,
      groundSpeed: 90,
      verticalSpeed: 0,
      onGround: true,
      landingRate: 0,
      landingDistance: 0,
      reverser1Deployed: false,
      reverser2Deployed: false
    },
    expected: FlightPhase.TAKEOFF_ROLL
  },
  {
    name: "initial climb",
    telemetry: {
      altitude: 5000,
      groundSpeed: 220,
      verticalSpeed: 1200,
      onGround: false
    },
    expected: FlightPhase.INITIAL_CLIMB
  },
  {
    name: "climb",
    telemetry: {
      altitude: 15000,
      groundSpeed: 300,
      verticalSpeed: 1200,
      onGround: false
    },
    expected: FlightPhase.CLIMB
  },
  {
    name: "cruise",
    telemetry: {
      altitude: 35000,
      groundSpeed: 450,
      verticalSpeed: 100,
      onGround: false
    },
    expected: FlightPhase.CRUISE
  },
  {
    name: "descent",
    telemetry: {
      altitude: 15000,
      groundSpeed: 320,
      verticalSpeed: -1000,
      onGround: false
    },
    expected: FlightPhase.DESCENT
  },
  {
    name: "approach",
    telemetry: {
      altitude: 3000,
      groundSpeed: 150,
      verticalSpeed: -700,
      onGround: false,
      gearDown: true,
      ilsCaptured: true
    },
    expected: FlightPhase.APPROACH
  },
  {
    name: "landing rollout",
    telemetry: {
      altitude: 0,
      groundSpeed: 90,
      verticalSpeed: 0,
      onGround: true,
      landingRate: -150
    },
    expected: FlightPhase.LANDING
  },
  {
    name: "taxi in",
    telemetry: {
      altitude: 0,
      groundSpeed: 20,
      verticalSpeed: 0,
      onGround: true,
      landingDistance: 900
    },
    expected: FlightPhase.TAXI_IN
  },
  {
    name: "unknown airborne state",
    telemetry: {
      altitude: 20000,
      groundSpeed: 300,
      verticalSpeed: 0,
      onGround: false
    },
    expected: FlightPhase.UNKNOWN
  }
];


assert.deepEqual(
  [...new Set(cases.map(item => item.expected))].sort(),
  Object.values(FlightPhase).sort(),
  "PhaseDetector test cases must cover every FlightPhase value"
);


for (const testCase of cases) {

  assert.equal(
    detector.detect(testCase.telemetry),
    testCase.expected,
    testCase.name
  );

}


console.log(
  `PhaseDetector tests passed (${cases.length} cases).`
);
