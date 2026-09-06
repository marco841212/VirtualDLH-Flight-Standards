export interface CockpitResult {
    lights: number;
    levers: number;
    procedures: number;
    issues: string[];
}
export declare class CockpitTracker {
    private aircraft;
    private result;
    initialize(aircraft: string): void;
    processEvent(event: string, data: any): void;
    private checkLights;
    private checkLevers;
    private checkProcedures;
    getResults(): CockpitResult;
}
