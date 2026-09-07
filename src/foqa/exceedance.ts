import { FOQAEvent } from "./events.js";


export interface FOQAExceedance {

  event: string;

  severity: "LOW" | "MEDIUM" | "HIGH";

  scoreImpact: number;

  description: string;

  trainingRecommendation: string;

}


export class ExceedanceEngine {


  evaluate(
    events: FOQAEvent[]
  ): FOQAExceedance[] {


    const exceedances: FOQAExceedance[] = [];


    for (const event of events) {


      switch (event.type) {


        case "HARD_LANDING":

          exceedances.push({

            event: event.type,

            severity: "HIGH",

            scoreImpact: -20,

            description:
              "Landing exceeded acceptable touchdown limits",

            trainingRecommendation:
              "Review flare timing, touchdown control, and landing technique"

          });

          break;



        case "OVERSPEED":

          exceedances.push({

            event: event.type,

            severity: "HIGH",

            scoreImpact: -15,

            description:
              "Aircraft exceeded operational speed limits",

            trainingRecommendation:
              "Review speed management and aircraft limitations"

          });

          break;



        case "EXCESSIVE_SINK_RATE":

          exceedances.push({

            event: event.type,

            severity: "HIGH",

            scoreImpact: -15,

            description:
              "Excessive vertical descent rate detected",

            trainingRecommendation:
              "Review energy management and descent planning"

          });

          break;



        case "UNSTABLE_APPROACH":

          exceedances.push({

            event: event.type,

            severity: "MEDIUM",

            scoreImpact: -10,

            description:
              "Approach exceeded stabilized approach criteria",

            trainingRecommendation:
              "Review approach preparation and go-around decisions"

          });

          break;



        case "HIGH_SPEED_TAXI":

          exceedances.push({

            event: event.type,

            severity: "MEDIUM",

            scoreImpact: -10,

            description:
              "Taxi speed exceeded recommended limits",

            trainingRecommendation:
              "Review ground handling procedures"

          });

          break;



        case "ALTITUDE_DEVIATION":

          exceedances.push({

            event: event.type,

            severity: "MEDIUM",

            scoreImpact: -10,

            description:
              "Altitude deviation detected",

            trainingRecommendation:
              "Review altitude awareness and automation monitoring"

          });

          break;



        case "EXCESSIVE_BANK":

          exceedances.push({

            event: event.type,

            severity: "HIGH",

            scoreImpact: -15,

            description:
              "Excessive bank angle detected",

            trainingRecommendation:
              "Review aircraft handling and flight envelope awareness"

          });

          break;


      }

    }


    return exceedances;

  }

}
