    import { StratosConfig } from "../config/stratos.js";


export class StratosClient {

  private token?: string;


  constructor(token?: string) {

    this.token =
      token ??
      process.env.STRATOS_TOKEN?.trim();

  }


  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {


    const response = await fetch(
      `${StratosConfig.baseURL}${endpoint}`,
      {
        ...options,

        headers: {
          ...StratosConfig.headers,

          ...(this.token && {
            Authorization:
              `Bearer ${this.token}`
          })
        }
      }
    );


    if (!response.ok) {

      throw new Error(
        `Stratos API Error ${response.status}`
      );

    }


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



  async getAirports() {

    return this.request(
      StratosConfig.endpoints.airports
    );

  }



  async getAnnouncements() {

    return this.request(
      StratosConfig.endpoints.announcements
    );

  }



  async startFlight(
    data: unknown
  ) {

    return this.request(
      StratosConfig.endpoints.startFlight,
      {
        method: "POST",

        body:
          JSON.stringify(data)
      }
    );

  }



  async updateFlight(
    flightId: string,
    data: unknown
  ) {

    return this.request(
      `${StratosConfig.endpoints.updateFlight}/${flightId}`,
      {
        method: "POST",

        body:
          JSON.stringify(data)
      }
    );

  }



  async completeFlight(
    flightId: string
  ) {

    return this.request(
      `${StratosConfig.endpoints.completeFlight}/${flightId}`,
      {
        method: "POST"
      }
    );

  }



  async cancelFlight(
    flightId: string
  ) {

    return this.request(
      `${StratosConfig.endpoints.cancelFlight}/${flightId}`,
      {
        method: "POST"
      }
    );

  }

}
