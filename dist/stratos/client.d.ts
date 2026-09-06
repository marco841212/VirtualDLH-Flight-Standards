export interface StratosConfig {
    endpoint: string;
    apiKey?: string;
}
export declare function createStratosClient(config: StratosConfig): {
    endpoint: string;
    connected: boolean;
    connect(): boolean;
};
