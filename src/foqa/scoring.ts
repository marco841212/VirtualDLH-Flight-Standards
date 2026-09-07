import { FOQAExceedance } from "./exceedance.js";


export interface FOQAScore {

  startingScore: number;

  finalScore: number;

  rating: string;

  trainingRequired: boolean;

  exceedances: FOQAExceedance[];

}



export class FOQAScoringEngine {


  calculate(

    sopScore: number,

    exceedances: FOQAExceedance[]

  ): FOQAScore {


    let finalScore = sopScore;



    for (const event of exceedances) {

      finalScore += event.scoreImpact;

    }



    if (finalScore < 0) {

      finalScore = 0;

    }


    let rating = "UNSATISFACTORY";


    if (finalScore >= 95) {

      rating = "EXCELLENT";

    }

    else if (finalScore >= 85) {

      rating = "SATISFACTORY";

    }

    else if (finalScore >= 70) {

      rating = "NEEDS IMPROVEMENT";

    }



    return {

      startingScore: sopScore,

      finalScore,

      rating,

      trainingRequired:
        finalScore < 85,

      exceedances

    };

  }

}
