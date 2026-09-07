export interface TakeoffData {

    beacon: boolean;

    strobe: boolean;

    landingLights: boolean;

    rotationSpeed?: number;

    climbRate?: number;

}



export interface SOPResult {

    score: number;

    passed: boolean;

    notes: string[];

}



export class TakeoffRules {


    evaluate(
        data: TakeoffData
    ): SOPResult {


        let score = 100;

        const notes: string[] = [];



        if (!data.beacon) {

            score -= 20;

            notes.push(
                "Beacon light not configured"
            );

        }



        if (!data.strobe) {

            score -= 20;

            notes.push(
                "Strobe light not configured"
            );

        }



        if (!data.landingLights) {

            score -= 10;

            notes.push(
                "Landing lights not configured"
            );

        }



        if (
            data.climbRate !== undefined &&
            data.climbRate < 500
        ) {

            score -= 10;

            notes.push(
                "Low initial climb performance"
            );

        }



        return {

            score,

            passed: score >= 80,

            notes

        };

    }

}
