import { createPlugin } from "@skyvexsoftware/stratos-sdk/helpers";

import {
  PluginRuntime
} from "../core/pluginRuntime.js";


export const runtime =
  new PluginRuntime();


export default createPlugin({

  async onStart(ctx) {

    ctx.logger.info(
      "VirtualDLH Flight Standards",
      "Starting live Stratos telemetry connection"
    );

    await runtime.connectStratosFlight(
      ctx.flight
    );

    ctx.logger.info(
      "VirtualDLH Flight Standards",
      "Live Stratos telemetry connected"
    );

  },


  async onStop(ctx) {

    runtime.disconnectStratosFlight();

    ctx.logger.info(
      "VirtualDLH Flight Standards",
      "Stratos telemetry disconnected"
    );

  }

});
