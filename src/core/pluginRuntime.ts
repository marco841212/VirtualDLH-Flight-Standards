import { RuntimeDataManager } from "./runtimeDataManager.js";
import { TelemetryData } from "../stratos/telemetry.js";
import {
  StandardsController,
  StandardsFlightRequest
} from "../integration/standardsController.js";


export class PluginRuntime {


    private runtimeData:
        RuntimeDataManager;

    private standards:
        StandardsController;



    constructor() {

        this.runtimeData =
            new RuntimeDataManager();

        this.standards =
            new StandardsController();

    }



    receiveTelemetry(
        data: TelemetryData
    ) {

        return this.runtimeData.receiveTelemetry(
            data
        );

    }



    async evaluateFlight(
        request: StandardsFlightRequest
    ) {

        return this.standards.evaluateFlight(
            request
        );

    }

}
