export class PilotHistory {
    constructor() {
        this.flights = [];
    }
    addFlight(entry) {
        this.flights.push(entry);
    }
    getHistory(pilot) {
        return this.flights.filter(flight => flight.pilot === pilot);
    }
    getAverageScore(pilot) {
        const history = this.getHistory(pilot);
        if (history.length === 0) {
            return 0;
        }
        const total = history.reduce((sum, flight) => sum + flight.score, 0);
        return Math.round(total / history.length);
    }
}
//# sourceMappingURL=pilotHistory.js.map