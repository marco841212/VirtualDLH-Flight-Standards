export interface FlightResult {
    pilot: string;
    flight: string;
    aircraft: string;
    score: number;
    points: number;
}
export declare function prepareFlightSync(result: FlightResult): {
    synced: boolean;
    pilot: string;
    flight: string;
    aircraft: string;
    score: number;
    points: number;
};
