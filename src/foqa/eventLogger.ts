export interface FOQAEvent {
  type: string;
  timestamp: string;
  value?: string | number | boolean;
  severity: "info" | "warning" | "critical";
}

export function logFOQAEvent(event: FOQAEvent) {
  return {
    ...event,
    recorded: true
  };
}
