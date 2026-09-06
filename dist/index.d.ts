export declare class VirtualDLHCockpitStandardsPlugin {
    private validator;
    private history;
    private reports;
    private adminReports;
    private scoring;
    private cockpit;
    initialize(): {
        plugin: string;
        version: string;
        status: {
            pluginLoaded: boolean;
            cockpitReady: boolean;
            scoringReady: boolean;
            reportsReady: boolean;
            timestamp: string;
        };
    };
    startFlight(pilot: string, aircraft: string, route: string): {
        pilot: string;
        aircraft: string;
        route: string;
        message: string;
    };
    completeFlight(pilot: string, aircraft: string, route: string): {
        title: string;
        pilot: string;
        aircraft: string;
        route: string;
        finalScore: string;
        grade: string;
        strengths: string[];
        improvements: string[];
        generatedAt: string;
    };
}
export default VirtualDLHCockpitStandardsPlugin;
