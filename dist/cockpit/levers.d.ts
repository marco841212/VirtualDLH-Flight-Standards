export interface LeverState {
    throttle: number;
    flaps: number;
    gearDown: boolean;
    spoilersArmed: boolean;
}
export declare function evaluateLevers(state: LeverState): {
    points: number;
    issues: string[];
};
