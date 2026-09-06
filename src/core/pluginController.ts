import { FlightLifecycle } from "../stratos/flightLifecycle.js";
import { ReportBridge } from "../reports/reportBridge.js";


export class PluginController {

    private lifecycle: FlightLifecycle;

    private reports: ReportBridge;


    constructor() {

        this.lifecycle =
            new FlightLifecycle();

        this.reports =
            new ReportBridge();

    }


    processFlightEvent(
        event: string,
        data?: any
    ) {

        return this.lifecycle.process(
            event,
            data
        );

    }


    finalizeFlight(
        pilot: string,
        flight: string,
        aircraft: string
    ) {

        const summary =
            this.lifecycle.complete(
                pilot,
                flight,
                aircraft
            );


        return this.reports.createPilotReport(
            summary
        );

    }

}
