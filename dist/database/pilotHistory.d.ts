export interface PilotHistoryEntry {
    pilot: string;
    flight: string;
    aircraft: string;
    score: number;
    date: string;
}
export declare class PilotHistory {
    private flights;
    addFlight(entry: PilotHistoryEntry): void;
    getHistory(pilot: string): PilotHistoryEntry[];
    getAverageScore(pilot: string): number;
}
