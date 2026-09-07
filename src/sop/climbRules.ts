export interface ClimbData {

    targetAltitude: number;

    currentAltitude: number;

    speedStable: boolean;

    configurationClean: boolean;

    climbRate?: number;

}


export interface SOPResult {

    score: number;

    passed: boolean;

    notes: string[];

}


export class ClimbRules {


    evaluate(
        data: ClimbData
    ): SOPResult {


        let score = 100;

        const notes: string[] = [];


        if (!data.speedStable) {

            score -= 20;

            notes.push(
                "Speed not stabilized during climb"
            );

        }


        if (!data.configurationClean) {

            score -= 20;

            notes.push(
                "Aircraft configuration not cleaned"
            );

        }


        if (
            data.currentAltitude < data.targetAltitude
        ) {

            score -= 10;

            notes.push(
                "Altitude not reached"
            );

        }


        if (
            data.climbRate !== undefined &&
            data.climbRate < 500
        ) {

            score -= 10;

            notes.push(
                "Low climb performance"
            );

        }


        return {

            score,

            passed: score >= 80,

            notes

        };

    }

}
