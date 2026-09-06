export class CockpitTracker {

    private aircraft: any = null;

    beacon = true;
    strobe = true;
    landing = true;
    taxiOffAfterTakeoff = true;


    initialize(aircraft: any) {

        this.aircraft = aircraft;

        return {
            initialized: true,
            aircraft: this.aircraft
        };

    }


    check() {

        return {
            beacon: this.beacon,
            strobe: this.strobe,
            landing: this.landing,
            taxiOffAfterTakeoff: this.taxiOffAfterTakeoff
        };

    }

}