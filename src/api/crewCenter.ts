export interface FlightResult {
  pilot: string;
  flight: string;
  aircraft: string;
  score: number;
  points: number;
}

export function sendToCrewCenter(result: FlightResult) {
  return {
    status: "ready",
    payload: result
  };
}
