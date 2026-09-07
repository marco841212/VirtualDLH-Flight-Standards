import { FlightTelemetry } from "../evaluation/phaseDetector.js";


export interface StratosTelemetry {

  altitude?: number;

  ground_speed?: number;

  vertical_speed?: number;

  on_ground?: boolean;

  gear_down?: boolean;

  flaps_extended?: boolean;

  ils_captured?: boolean;

}



export class TelemetryAdapter {


  convert(
    data: StratosTelemetry
  ): FlightTelemetry {


    return {

      altitude:
        data.altitude ?? 0,


      groundSpeed:
        data.ground_speed ?? 0,


      verticalSpeed:
        data.vertical_speed ?? 0,


      onGround:
        data.on_ground ?? true,


      gearDown:
        data.gear_down ?? false,


      flapsExtended:
        data.flaps_extended ?? false,


      ilsCaptured:
        data.ils_captured ?? false

    };

  }

}
