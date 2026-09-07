import { RuntimeDataManager } from "./runtimeDataManager.js";
import { TelemetryData } from "../stratos/telemetry.js";


export class PluginRuntime {


    private runtimeData:
        RuntimeDataManager;



    constructor() {

        this.runtimeData =
            new RuntimeDataManager();

    }



    receiveTelemetry(
        data: TelemetryData
    ) {

        return this.runtimeData.receiveTelemetry(
            data
        );

    }

}
