export interface PilotHistoryEntry {
  pilot: string;
  flight: string;
  aircraft: string;
  score: number;
  date: string;
}

export class PilotHistory {

  private flights: PilotHistoryEntry[] = [];

  addFlight(entry: PilotHistoryEntry) {
    this.flights.push(entry);
  }

  getHistory(pilot: string) {
    return this.flights.filter(
      flight => flight.pilot === pilot
    );
  }

  getAverageScore(pilot: string) {

    const history = this.getHistory(pilot);

    if (history.length === 0) {
      return 0;
    }

    const total = history.reduce(
      (sum, flight) => sum + flight.score,
      0
    );

    return Math.round(total / history.length);
  }

}