import { FlightSummary } from "./flightSummary.js";
import { ReportGenerator } from "./reportGenerator.js";


export class ReportBridge {


    private generator: ReportGenerator;



    constructor() {

        this.generator =
            new ReportGenerator();

    }



    createPilotReport(
        summary: FlightSummary
    ) {

        return this.generator.generate(
            summary
        );

    }



    createAdminReport(
        summary: FlightSummary
    ) {

        const report =
            this.generator.generate(
                summary
            );


        return {

            ...report,

            review:

                report.summary.totalScore >= 90
                    ?
                    "Approved"
                    :
                    "Review Required"

        };

    }

}
