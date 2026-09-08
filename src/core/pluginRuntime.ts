import type {
  PluginFlightAccessor
} from "@skyvexsoftware/stratos-sdk";

import { RuntimeDataManager } from "./runtimeDataManager.js";
import { TelemetryData } from "../stratos/telemetry.js";

import {
  StandardsController,
  StandardsFlightRequest
} from "../integration/standardsController.js";

import {
  StratosSdkTelemetryBridge
} from "../stratos/sdkTelemetryBridge.js";


export class PluginRuntime {

  private runtimeData:
    RuntimeDataManager;

  private standards:
    StandardsController;

  private stratosTelemetry:
    StratosSdkTelemetryBridge | null = null;


  constructor() {

    this.runtimeData =
      new RuntimeDataManager();

    this.standards =
      new StandardsController();

  }


  receiveTelemetry(
    data: TelemetryData
  ) {

    return this.runtimeData.receiveTelemetry(
      data
    );

  }


  async connectStratosFlight(
    flight: PluginFlightAccessor
  ) {

    this.disconnectStratosFlight();

    const bridge =
      new StratosSdkTelemetryBridge(
        flight
      );

    await bridge.start();

    this.stratosTelemetry =
      bridge;

  }


  disconnectStratosFlight() {

    if (this.stratosTelemetry) {

      this.stratosTelemetry.stop();

      this.stratosTelemetry = null;

    }

  }


  hasLiveStratosTelemetry() {

    return (
      this.stratosTelemetry
        ?.hasLiveTelemetry()
      ?? false
    );

  }


  async evaluateFlight(
    request: StandardsFlightRequest
  ) {

    const telemetry =
      this.stratosTelemetry
        ?.getLatestTelemetry()
      ?? undefined;

    return this.standards.evaluateFlight(
      request,
      telemetry
    );

  }

}
