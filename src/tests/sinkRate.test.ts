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

    airspeed: 145,

    altitude: 1200,

    verticalSpeed: -2200,

    bankAngle: 5,

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
  "===== Excessive Sink Rate FOQA Test ====="
);


console.log(
  JSON.stringify(
    result,
    null,
    2
  )
);
