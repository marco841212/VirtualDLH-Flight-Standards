export interface AdminFlightReport {
    pilot: string;
    aircraft: string;
    flight: string;
    score: number;
    violations: string[];
    recommendation: string;
}
export declare class AdminReportGenerator {
    generate(data: AdminFlightReport): {
        title: string;
        pilot: string;
        aircraft: string;
        flight: string;
        score: string;
        violations: string[];
        trainingRecommendation: string;
        generatedAt: string;
    };
}
