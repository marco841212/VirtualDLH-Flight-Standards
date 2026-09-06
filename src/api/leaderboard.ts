export interface PilotRanking {
  pilot: string;
  points: number;
  rank: string;
}

export function updateLeaderboard(pilot: PilotRanking) {
  return pilot;
}
