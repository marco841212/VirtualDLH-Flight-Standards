export function createStratosClient(config) {
    return {
        endpoint: config.endpoint,
        connected: false,
        connect() {
            this.connected = true;
            return this.connected;
        }
    };
}
//# sourceMappingURL=client.js.map