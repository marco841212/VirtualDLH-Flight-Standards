export function evaluateControls(state) {
    let points = 0;
    const issues = [];
    if (state.flapsCorrect)
        points += 10;
    else
        issues.push('Flap configuration issue');
    if (state.gearCorrect)
        points += 10;
    else
        issues.push('Landing gear configuration issue');
    if (state.spoilersArmed)
        points += 10;
    if (state.autobrake)
        points += 5;
    return { points, issues };
}
//# sourceMappingURL=controls.js.map