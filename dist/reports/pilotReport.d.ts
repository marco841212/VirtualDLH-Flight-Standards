export interface PilotFlightReport {
    pilot: string;
    aircraft: string;
    route: string;
    score: number;
    grade: string;
    strengths: string[];
    improvements: string[];
}
export declare class PilotReportGenerator {
    generate(data: PilotFlightReport): {
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
