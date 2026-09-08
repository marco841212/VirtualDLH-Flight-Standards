export interface FlightGradeResult {

  score: number;

  rating: string;

  passed: boolean;

  trainingRequired: boolean;

}



export interface FlightGradeInput {

  cruiseScore: number;

  approachScore?: number;

  landingScore?: number;

  foqaScore: number;

}



export function calculateFlightGrade(
  data: FlightGradeInput
): FlightGradeResult {


  const components: {
    score: number;
    weight: number;
  }[] = [
    {
      score: data.cruiseScore,
      weight: 0.25
    },
    {
      score: data.foqaScore,
      weight: 0.25
    }
  ];


  if (data.approachScore !== undefined) {

    components.push({
      score: data.approachScore,
      weight: 0.25
    });

  }


  if (data.landingScore !== undefined) {

    components.push({
      score: data.landingScore,
      weight: 0.25
    });

  }


  const totalWeight =
    components.reduce(
      (total, item) =>
        total + item.weight,
      0
    );


  const weightedScore =
    components.reduce(
      (total, item) =>
        total +
        item.score * item.weight,
      0
    );


  const finalScore =
    totalWeight > 0
      ? Math.round(
          weightedScore /
          totalWeight
        )
      : 0;



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
