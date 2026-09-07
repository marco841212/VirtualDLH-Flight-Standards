import { TelemetryData } from "../stratos/telemetry.js";
import { TelemetryBridge } from "../stratos/telemetryBridge.js";


export class TelemetryController {


    private bridge: TelemetryBridge;



    constructor() {

        this.bridge =
            new TelemetryBridge();

    }



    receive(
        data: TelemetryData
    ) {

        return this.bridge.update(
            data
        );

    }

}

