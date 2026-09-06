export interface FlightResult {
  pilot: string;
  flight: string;
  aircraft: string;
  score: number;
  points: number;
}

export function prepareFlightSync(result: FlightResult) {
  return {
    ...result,
    synced: false
  };
}
