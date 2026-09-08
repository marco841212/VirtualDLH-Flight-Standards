import assert from "node:assert/strict";

import {
  FOQAEvents,
  FOQAEventType
} from "../foqa/events.js";
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

    airspeed: 360,

    altitude: 35000,

    verticalSpeed: 0,

    bankAngle: 2,

    approachStable: true,

    overspeedWarning: true

  });


assert.equal(
  events.some(
    event => event.type === FOQAEventType.OVERSPEED
  ),
  true,
  "Overspeed warning should produce an OVERSPEED FOQA event"
);


const findings =
  exceedance.evaluate(
    events
  );


const result =
  scoring.calculate(
    100,
    findings
  );


assert.equal(
  findings.some(
    finding => finding.event === FOQAEventType.OVERSPEED
  ),
  true,
  "OVERSPEED FOQA event should produce an exceedance"
);


console.log(
  "===== Overspeed FOQA Test ====="
);


console.log(
  JSON.stringify(
    result,
    null,
    2
  )
);
