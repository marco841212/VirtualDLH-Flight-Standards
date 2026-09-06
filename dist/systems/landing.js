export function evaluateLanding(data) {
    let score = 0;
    const feedback = [];
    if (data.stableApproach)
        score += 20;
    else
        feedback.push("Improve approach stability");
    if (data.spoilers)
        score += 10;
    if (data.reverse)
        score += 5;
    if (data.touchdownRate > -700)
        score += 15;
    else
        feedback.push("Improve touchdown performance");
    return { score, feedback };
}
//# sourceMappingURL=landing.js.map