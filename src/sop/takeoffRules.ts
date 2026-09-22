export interface TakeoffData {

    beacon?: boolean;

    strobe?: boolean;

    landingLights?: boolean;

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



        if (data.beacon === false) {

            score -= 20;

            notes.push(
                "Beacon light was OFF during takeoff"
            );

        }
        else if (data.beacon === true) {

            notes.push(
                "Beacon light confirmed ON during takeoff"
            );

        }



        if (data.strobe === false) {

            score -= 20;

            notes.push(
                "Strobe light was OFF during takeoff"
            );

        }
        else if (data.strobe === true) {

            notes.push(
                "Strobe light confirmed ON during takeoff"
            );

        }



        if (data.landingLights === false) {

            score -= 10;

            notes.push(
                "Landing lights were OFF during takeoff"
            );

        }
        else if (data.landingLights === true) {

            notes.push(
                "Landing lights confirmed ON during takeoff"
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



        if (
            data.beacon === undefined &&
            data.strobe === undefined &&
            data.landingLights === undefined
        ) {

            notes.push(
                "Aircraft light telemetry unavailable from Stratos for takeoff"
            );

        }



        return {

            score,

            passed: score >= 80,

            notes

        };

    }

}
