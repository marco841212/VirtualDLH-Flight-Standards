import { StratosConfig } from "../config/stratos.js";


export class StratosClient {

    private token?: string;


    constructor(token?: string) {
    this.token =
        token ??
        process.env.STRATOS_TOKEN;
}


    async request(
        endpoint: string,
        options: RequestInit = {}
    ) {

        const response = await fetch(
            `${StratosConfig.baseURL}${endpoint}`,
            {
                ...options,

                headers: {
                    ...StratosConfig.headers,

                    ...(this.token && {
                        Authorization:
                        `Bearer ${this.token}`
                    }),

                    ...options.headers
                }
            }
        );


        return response.json();

    }



    async verifyPilot() {

        return this.request(
            StratosConfig.endpoints.verify
        );

    }



    async getAircraft() {

        return this.request(
            StratosConfig.endpoints.aircraft
        );

    }


    async startFlight(data: any) {

        return this.request(
            StratosConfig.endpoints.startFlight,
            {
            }
        );

    }
    async updateFlight(data: any) {

        return this.request(
            StratosConfig.endpoints.updateFlight,
            {
                method: "POST",
                body: JSON.stringify(data)
            }
        );

    }


    async completeFlight(data: any) {

        return this.request(
            StratosConfig.endpoints.completeFlight,
            {
                method: "POST",
                body: JSON.stringify(data)
            }
        );

    }

}
