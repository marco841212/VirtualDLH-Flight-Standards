import { TelemetryData } from "./telemetry.js";
import { TelemetryProcessor } from "./telemetryProcessor.js";
import { FlightLifecycle } from "./flightLifecycle.js";


export class TelemetryBridge {


    private processor: TelemetryProcessor;

    private lifecycle: FlightLifecycle;



    constructor() {

        this.processor =
            new TelemetryProcessor();


        this.lifecycle =
            new FlightLifecycle();

    }



    update(
        data: TelemetryData
    ) {


        const event =
            this.processor.process(
                data
            );


        if (!event) {

            return null;

        }


        return this.lifecycle.process(
            event,
            data
        );

    }

}

