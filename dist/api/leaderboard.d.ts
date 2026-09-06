export interface PilotRanking {
    pilot: string;
    points: number;
    rank: string;
}
export declare function updateLeaderboard(pilot: PilotRanking): PilotRanking;
