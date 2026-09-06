export function calculateFinalFlightScore(scores) {
    const total = scores.cockpit * 0.30 +
        scores.procedures * 0.25 +
        scores.safety * 0.25 +
        scores.landing * 0.20;
    return Math.round(total);
}
//# sourceMappingURL=finalFlightScore.js.map