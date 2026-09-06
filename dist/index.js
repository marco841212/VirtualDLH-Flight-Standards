import { PluginValidator } from "./validation/pluginCheck";
import { PilotHistory } from "./database/pilotHistory";
import { PilotReportGenerator } from "./reports/pilotReport";
import { AdminReportGenerator } from "./reports/adminReport";
import { VirtualDLHConfig } from "./config/virtualdlh";
import { ScoringEngine } from "./scoring/scoringEngine";
import { CockpitTracker } from "./cockpit/tracker";
export class VirtualDLHCockpitStandardsPlugin {
    constructor() {
        this.validator = new PluginValidator();
        this.history = new PilotHistory();
        this.reports = new PilotReportGenerator();
        this.adminReports = new AdminReportGenerator();
        this.scoring = new ScoringEngine();
        this.cockpit = new CockpitTracker();
    }
    initialize() {
        return {
            plugin: VirtualDLHConfig.pluginName,
            version: VirtualDLHConfig.version,
            status: this.validator.validate()
        };
    }
    startFlight(pilot, aircraft, route) {
        this.cockpit.initialize(aircraft);
        return {
            pilot,
            aircraft,
            route,
            message: "VirtualDLH Cockpit Standards started"
        };
    }
    completeFlight(pilot, aircraft, route) {
        const score = this.scoring.getScore();
        const report = this.reports.generate({
            pilot,
            aircraft,
            route,
            score,
            grade: score >= 95
                ? "Platinum Pilot"
                : "Gold Pilot",
            strengths: [],
            improvements: []
        });
        this.history.addFlight({
            pilot,
            aircraft,
            flight: route,
            score,
            date: new Date().toISOString()
        });
        return report;
    }
}
export default VirtualDLHCockpitStandardsPlugin;
//# sourceMappingURL=index.js.map