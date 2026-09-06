export interface OverheadState {
    battery?: boolean;
    apu?: boolean;
    fuelPumps?: boolean;
    antiIce?: boolean;
    seatbeltSigns?: boolean;
}
export declare function evaluateOverhead(state: OverheadState): {
    points: number;
    issues: string[];
};
