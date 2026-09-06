export function evaluateLights(state) {
    let points = 0;
    const issues = [];
    if (state.beacon)
        points += 5;
    else
        issues.push('Beacon light not configured correctly');
    if (state.nav)
        points += 5;
    if (state.strobe)
        points += 5;
    return { points, issues };
}
//# sourceMappingURL=lights.js.map