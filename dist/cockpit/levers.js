export function evaluateLevers(state) {
    let points = 0;
    const issues = [];
    if (state.gearDown)
        points += 10;
    if (state.spoilersArmed)
        points += 10;
    if (state.flaps >= 0)
        points += 5;
    return { points, issues };
}
//# sourceMappingURL=levers.js.map