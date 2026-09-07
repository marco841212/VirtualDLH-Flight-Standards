import { StandardsController } from "../integration/standardsController.js";


async function runNormalFlightTest(): Promise<void> {

  console.log(
    "===== VirtualDLH Flight Standards Test ====="
  );


  const controller = new StandardsController();


  const result = await controller.evaluateFlight({

    flightId: "DLH001",

    pilotName: "VirtualDLH Test Pilot",

    flightNumber: "DLH001",

    aircraft: "A350-900",

    route: "EDDF-KJFK"

  });


  console.log(
    JSON.stringify(result, null, 2)
  );

}


runNormalFlightTest()
  .catch((error) => {

    console.error(error);

    process.exit(1);

  });
