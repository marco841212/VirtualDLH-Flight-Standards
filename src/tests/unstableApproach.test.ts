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

    airspeed: 170,

    altitude: 1500,

    verticalSpeed: -1800,

    bankAngle: 10,

    approachStable: false

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
  "===== Unstable Approach FOQA Test ====="
);


console.log(
  JSON.stringify(
    result,
    null,
    2
  )
);
