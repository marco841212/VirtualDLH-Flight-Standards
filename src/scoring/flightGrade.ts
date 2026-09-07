export interface FlightGradeResult {

  score: number;

  rating: string;

  passed: boolean;

  trainingRequired: boolean;

}



export interface FlightGradeInput {

  cruiseScore: number;

  approachScore: number;

  landingScore: number;

  foqaScore: number;

}



export function calculateFlightGrade(
  data: FlightGradeInput
): FlightGradeResult {


  const finalScore =
    Math.round(

      (
        data.cruiseScore * 0.25
        +
        data.approachScore * 0.25
        +
        data.landingScore * 0.25
        +
        data.foqaScore * 0.25

      )

    );



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

    score:
      finalScore,

    rating,

    passed:
      finalScore >= 80,

    trainingRequired:
      finalScore < 80

  };

}
