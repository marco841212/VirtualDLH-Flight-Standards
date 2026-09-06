import { evaluateLights } from '../cockpit/lights';
import { evaluateLevers } from '../cockpit/levers';
export function calculateCockpitScore(data) {
    const lights = evaluateLights(data.lights);
    const levers = evaluateLevers(data.levers);
    return {
        score: lights.points + levers.points,
        issues: [...lights.issues, ...levers.issues]
    };
}
//# sourceMappingURL=cockpitScore.js.map