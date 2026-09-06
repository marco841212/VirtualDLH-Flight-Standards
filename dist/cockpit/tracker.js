export class CockpitTracker {
    constructor() {
        this.aircraft = null;
        this.beacon = true;
        this.strobe = true;
        this.landing = true;
        this.taxiOffAfterTakeoff = true;
    }
    initialize(aircraft) {
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
//# sourceMappingURL=tracker.js.map