export interface LightState {
    beacon: boolean;
    strobe: boolean;
    landing: boolean;
    taxi: boolean;
    nav: boolean;
}
export declare function evaluateLights(state: LightState): {
    points: number;
    issues: string[];
};
