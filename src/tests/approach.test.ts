import {
  evaluateApproach
} from "../sop/approachRules.js";



console.log(
  "===== Approach SOP Test ====="
);



const stableApproach =
  evaluateApproach({

    altitude: 1500,

    airspeed: 140,

    targetSpeed: 140,

    verticalSpeed: -700,

    localizerDeviation: 0.2,

    glideslopeDeviation: 0.2,

    gearDown: true,

    flapsConfigured: true,

    autopilotDisconnected: false,

    unstableApproach: false

  });



console.log(
  "\n--- Stable Approach ---"
);


console.log(
  JSON.stringify(
    stableApproach,
    null,
    2
  )
);



const unstableApproach =
  evaluateApproach({

    altitude: 1500,

    airspeed: 170,

    targetSpeed: 140,

    verticalSpeed: -1600,

    localizerDeviation: 1.5,

    glideslopeDeviation: 1.5,

    gearDown: false,

    flapsConfigured: false,

    autopilotDisconnected: true,

    unstableApproach: true

  });



console.log(
  "\n--- Unstable Approach ---"
);


console.log(
  JSON.stringify(
    unstableApproach,
    null,
    2
  )
);
