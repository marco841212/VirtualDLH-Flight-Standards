export class AdminReportGenerator {
    generate(data) {
        return {
            title: "VirtualDLH Operations Report",
            pilot: data.pilot,
            aircraft: data.aircraft,
            flight: data.flight,
            score: `${data.score}/100`,
            violations: data.violations,
            trainingRecommendation: data.recommendation,
            generatedAt: new Date().toISOString()
        };
    }
}
//# sourceMappingURL=adminReport.js.map