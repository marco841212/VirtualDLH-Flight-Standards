import { FOQAEvents } from "../foqa/events.js";
import { ExceedanceEngine } from "../foqa/exceedance.js";
import { FOQAScoringEngine } from "../foqa/scoring.js";


const foqa =
  new FOQAEvents();


const exceedance =
  new ExceedanceEngine();


const scoring =
  new FOQAScoringEngine();



const events =
  foqa.detect({

    airspeed: 140,

    altitude: 0,

    verticalSpeed: -800,

    bankAngle: 2,

    landingRate: -750,

    approachStable: true

  });



const findings =
  exceedance.evaluate(
    events
  );


const result =
  scoring.calculate(
    100,
    findings
  );


console.log(
  "===== Hard Landing FOQA Test ====="
);


console.log(
  JSON.stringify(
    result,
    null,
    2
  )
);
