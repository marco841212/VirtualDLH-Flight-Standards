export function evaluateOverhead(state) {
    let points = 0;
    const issues = [];
    if (state.battery)
        points += 5;
    else
        issues.push('Battery procedure incomplete');
    if (state.fuelPumps)
        points += 5;
    else
        issues.push('Fuel pump check missing');
    if (state.apu)
        points += 5;
    if (state.antiIce)
        points += 5;
    return { points, issues };
}
//# sourceMappingURL=overhead.js.map