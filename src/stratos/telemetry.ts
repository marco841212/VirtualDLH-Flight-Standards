export interface TelemetryData {

    altitude: number;

    airspeed: number;

    heading: number;

    verticalSpeed: number;

    latitude?: number;

    longitude?: number;

    timestamp: string;

}



export class TelemetryReader {


    private latestData:
        TelemetryData | null = null;



    update(
        data: TelemetryData
    ) {

        this.latestData = data;

        return this.latestData;

    }



    getLatest() {

        return this.latestData;

    }



    isFlying() {

        if (!this.latestData) {

            return false;

        }


        return this.latestData.altitude > 1000;

    }

}
