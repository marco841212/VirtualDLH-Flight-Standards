export function calculateFinalFlightScore(scores: {
  cockpit: number;
  procedures: number;
  safety: number;
  landing: number;
}) {
  const total =
    scores.cockpit * 0.30 +
    scores.procedures * 0.25 +
    scores.safety * 0.25 +
    scores.landing * 0.20;

  return Math.round(total);
}
