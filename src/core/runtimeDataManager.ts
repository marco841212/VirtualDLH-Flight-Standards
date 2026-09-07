import { TelemetryData } from "../stratos/telemetry.js";
import { TelemetryController } from "./telemetryController.js";


export class RuntimeDataManager {


    private telemetry:
        TelemetryController;



    constructor() {

        this.telemetry =
            new TelemetryController();

    }



    receiveTelemetry(
        data: TelemetryData
    ) {

        return this.telemetry.receive(
            data
        );

    }

}
