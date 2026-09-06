export interface FOQAEvent {
    type: string;
    timestamp: string;
    value?: string | number | boolean;
    severity: "info" | "warning" | "critical";
}
export declare function logFOQAEvent(event: FOQAEvent): {
    recorded: boolean;
    type: string;
    timestamp: string;
    value?: string | number | boolean;
    severity: "info" | "warning" | "critical";
};
