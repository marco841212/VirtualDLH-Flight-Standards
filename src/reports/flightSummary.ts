import { FlightPhase } from "../simulator/phaseManager.js";


export interface FlightPhaseResult {

    phase: FlightPhase;

    score: number;

    notes: string[];

}



export interface FlightSummary {

    pilot: string;

    flight: string;

    aircraft: string;

    phases: FlightPhaseResult[];

    totalScore: number;

    remarks: string[];

}



export class FlightSummaryBuilder {



    create(
        pilot: string,
        flight: string,
        aircraft: string,
        phases: FlightPhaseResult[]
    ): FlightSummary {


        const totalScore =
            phases.length > 0
                ?
                Math.round(
                    phases.reduce(
                        (total, item) =>
                            total + item.score,
                        0
                    ) / phases.length
                )
                :
                0;



        const remarks: string[] = [];


        if (totalScore >= 95) {

            remarks.push(
                "Excellent flight performance"
            );

        }
        else if (totalScore >= 80) {

            remarks.push(
                "Good flight performance"
            );

        }
        else {

            remarks.push(
                "Additional training recommended"
            );

        }



        return {

            pilot,

            flight,

            aircraft,

            phases,

            totalScore,

            remarks

        };

    }

}
