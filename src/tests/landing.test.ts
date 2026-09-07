import {
  evaluateLanding
} from "../sop/landingRules.js";


console.log(
  "===== Landing SOP Test ====="
);



const normalLanding =
  evaluateLanding({

    touchdownRate: -150,

    touchdownDistance: 900,

    runwayLength: 3000,

    centerlineDeviation: 2,

    reverseThrustUsed: true,

    brakingIssue: false,

    bouncedLanding: false

  });



console.log(
  "\n--- Normal Landing ---"
);


console.log(
  JSON.stringify(
    normalLanding,
    null,
    2
  )
);



const hardLanding =
  evaluateLanding({

    touchdownRate: -850,

    touchdownDistance: 2500,

    runwayLength: 3000,

    centerlineDeviation: 12,

    reverseThrustUsed: true,

    brakingIssue: true,

    bouncedLanding: true

  });



console.log(
  "\n--- Hard Landing ---"
);


console.log(
  JSON.stringify(
    hardLanding,
    null,
    2
  )
);

