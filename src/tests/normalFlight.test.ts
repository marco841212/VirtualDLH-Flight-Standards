import assert from "node:assert/strict";

import { StandardsController } from "../integration/standardsController.js";
import { FlightPhase } from "../evaluation/phaseDetector.js";


async function runNormalFlightTest(): Promise<void> {

  console.log(
    "===== VirtualDLH Flight Standards Test ====="
  );


  const controller =
    new StandardsController();


  const result =
    await controller.evaluateFlight(
      {

        flightId: "DLH001",

        pilotName: "VirtualDLH Test Pilot",

        flightNumber: "DLH001",

        aircraft: "A350-900",

        route: "EDDF-KJFK"

      },
      {

        altitude: 35000,

        cruise_altitude: 35000,

        ground_speed: 450,

        indicated_airspeed: 280,

        vertical_speed: 0,

        bank_angle: 2,

        on_ground: false,

        overspeed_warning: false,

        stall_warning: false

      }
    );


  if (!result.success) {

    throw new Error(
      `Normal flight evaluation failed: ${result.error}`
    );

  }


  assert.equal(
    result.evaluation.phase,
    FlightPhase.CRUISE,
    "Normal cruise telemetry should resolve to CRUISE"
  );


  assert.deepEqual(
    result.evaluation.exceedances,
    [],
    "Normal flight should not produce FOQA exceedances"
  );


  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );


  console.log(
    "Normal flight evaluation test passed."
  );

}


runNormalFlightTest()
  .catch((error) => {

    console.error(error);

    process.exit(1);

  });
