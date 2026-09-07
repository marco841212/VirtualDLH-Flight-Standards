import { TelemetryData } from "./telemetry.js";
import { StratosEvents } from "./events.js";


export class TelemetryProcessor {


    process(
        data: TelemetryData
    ): string | null {


        if (data.altitude < 50) {

            return StratosEvents.STARTED;

        }


        if (
            data.altitude > 1000 &&
            data.verticalSpeed > 500
        ) {

            return StratosEvents.TAKEOFF;

        }


        if (
            data.altitude > 10000 &&
            Math.abs(data.verticalSpeed) < 500
        ) {

            return StratosEvents.CRUISE;

        }


        if (
            data.verticalSpeed < -500 &&
            data.altitude > 3000
        ) {

            return StratosEvents.APPROACH;

        }


        if (
            data.altitude < 1000 &&
            data.verticalSpeed < 0
        ) {

            return StratosEvents.LANDING;

        }


        return null;

    }

}
