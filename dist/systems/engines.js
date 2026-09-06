export function evaluateEngines(state) {
    let points = 0;
    const issues = [];
    if (state.correctStartSequence) {
        points += 25;
    }
    else {
        issues.push("Incorrect engine start sequence");
    }
    return { points, issues };
}
//# sourceMappingURL=engines.js.map