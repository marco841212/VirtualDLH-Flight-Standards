export declare class CockpitTracker {
    private aircraft;
    beacon: boolean;
    strobe: boolean;
    landing: boolean;
    taxiOffAfterTakeoff: boolean;
    initialize(aircraft: any): {
        initialized: boolean;
        aircraft: any;
    };
    check(): {
        beacon: boolean;
        strobe: boolean;
        landing: boolean;
        taxiOffAfterTakeoff: boolean;
    };
}
