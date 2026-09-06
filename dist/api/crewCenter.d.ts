export interface FlightResult {
    pilot: string;
    flight: string;
    aircraft: string;
    score: number;
    points: number;
}
export declare function sendToCrewCenter(result: FlightResult): {
    status: string;
    payload: FlightResult;
};
