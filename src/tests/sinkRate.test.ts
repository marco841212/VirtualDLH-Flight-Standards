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

    airspeed: 145,

    altitude: 1200,

    verticalSpeed: -2600,

    bankAngle: 5,

    approachStable: true

  });


assert.equal(
  events.some(
    event => event.type === FOQAEventType.EXCESSIVE_SINK_RATE
  ),
  true,
  "Sink rate below -2500 fpm should produce an EXCESSIVE_SINK_RATE FOQA event"
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
    finding => finding.event === FOQAEventType.EXCESSIVE_SINK_RATE
  ),
  true,
  "EXCESSIVE_SINK_RATE FOQA event should produce an exceedance"
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
