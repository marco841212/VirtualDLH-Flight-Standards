import { FlightSummary } from "./flightSummary.js";


export interface GeneratedPilotReport {

    title: string;

    summary: FlightSummary;

    grade: string;

    status: string;

}



export class ReportGenerator {



    generate(
        summary: FlightSummary
    ): GeneratedPilotReport {


        let grade = "F";


        if (summary.totalScore >= 95) {

            grade = "A";

        }
        else if (summary.totalScore >= 90) {

            grade = "B";

        }
        else if (summary.totalScore >= 80) {

            grade = "C";

        }
        else if (summary.totalScore >= 70) {

            grade = "D";

        }



        return {

            title:
                "VirtualDLH Flight Standards Report",

            summary,

            grade,

            status:
                summary.totalScore >= 80
                    ?
                    "PASS"
                    :
                    "TRAINING REQUIRED"

        };

    }

}
