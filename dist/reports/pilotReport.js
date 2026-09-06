export class PilotReportGenerator {
    generate(data) {
        return {
            title: "VirtualDLH Flight Standards Report",
            pilot: data.pilot,
            aircraft: data.aircraft,
            route: data.route,
            finalScore: `${data.score}/100`,
            grade: data.grade,
            strengths: data.strengths,
            improvements: data.improvements,
            generatedAt: new Date().toISOString()
        };
    }
}
//# sourceMappingURL=pilotReport.js.map