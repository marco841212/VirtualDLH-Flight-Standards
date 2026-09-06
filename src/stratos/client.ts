export interface StratosConfig {
  endpoint: string;
  apiKey?: string;
}

export function createStratosClient(config: StratosConfig) {
  return {
    endpoint: config.endpoint,
    connected: false,
    connect() {
      this.connected = true;
      return this.connected;
    }
  };
}
