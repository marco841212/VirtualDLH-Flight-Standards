import type {
  FlightData,
  PluginFlightAccessor,
  SimDataSnapshot
} from "@skyvexsoftware/stratos-sdk";

import type {
  StratosTelemetry
} from "./telemetryAdapter.js";


export class StratosSdkTelemetryBridge {

  private flight: PluginFlightAccessor;

  private latestTelemetry:
    StratosTelemetry | null = null;

  private unsubscribe:
    (() => void) | null = null;


  constructor(
    flight: PluginFlightAccessor
  ) {

    this.flight = flight;

  }


  async start() {

    /*
     * Hydrate from the current Stratos simulator snapshot first.
     */
    const snapshot =
      await this.flight.getSnapshot();

    if (snapshot) {

      this.capture(
        snapshot
      );

    }


    /*
     * Subscribe to live simulator frames.
     */
    this.unsubscribe =
      this.flight.onSimData(
        snapshot => {

          this.capture(
            snapshot
          );

        }
      );

  }


  stop() {

    if (this.unsubscribe) {

      this.unsubscribe();

      this.unsubscribe = null;

    }

  }


  getLatestTelemetry():
    StratosTelemetry | null {

    return this.latestTelemetry;

  }


  hasLiveTelemetry() {

    return this.latestTelemetry !== null;

  }


  private capture(
    snapshot: SimDataSnapshot
  ) {

    if (
      !snapshot.isConnected ||
      !snapshot.data
    ) {

      return;

    }


    this.latestTelemetry =
      this.convertFlightData(
        snapshot.data
      );

  }


  private convertFlightData(
    data: FlightData
  ): StratosTelemetry {

    return {

      altitude:
        data.altitude,

      ground_speed:
        data.groundSpeed,

      vertical_speed:
        data.verticalSpeed,

      on_ground:
        data.planeOnground,

      gear_down:
        data.gearControl,

      flaps_extended:
        (
          data.flapsControl > 0 ||
          data.flapsLeftPosition > 0 ||
          data.flapsRightPosition > 0
        )

    };

  }

}
