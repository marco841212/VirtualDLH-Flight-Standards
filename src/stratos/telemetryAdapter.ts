import { FlightTelemetry } from "../evaluation/phaseDetector.js";


export interface StratosTelemetry {

  altitude?: number;

  altitude_agl?: number;

  cruise_altitude?: number;

  ground_speed?: number;

  indicated_airspeed?: number;

  vertical_speed?: number;

  bank_angle?: number;

  pitch?: number;

  on_ground?: boolean;

  gear_down?: boolean;

  flaps_extended?: boolean;

  ils_captured?: boolean;

  overspeed_warning?: boolean;

  stall_warning?: boolean;

  crashed?: boolean;

  landing_rate?: number;

  landing_distance?: number;

  glideslope_deviation?: number;

  localizer_deviation?: number;

  reverser_1_deployed?: boolean;

  reverser_2_deployed?: boolean;

  autobrake_position?: number;

  speedbrake_position?: number;

}



export class TelemetryAdapter {


  convert(
    data: StratosTelemetry
  ): FlightTelemetry {


    return {

      altitude:
        data.altitude ?? 0,


      altitudeAgl:
        data.altitude_agl,


      cruiseAltitude:
        data.cruise_altitude,


      groundSpeed:
        data.ground_speed ?? 0,


      indicatedAirspeed:
        data.indicated_airspeed,


      verticalSpeed:
        data.vertical_speed ?? 0,


      bankAngle:
        data.bank_angle,


      pitch:
        data.pitch,


      onGround:
        data.on_ground ?? true,


      gearDown:
        data.gear_down ?? false,


      flapsExtended:
        data.flaps_extended ?? false,


      ilsCaptured:
        data.ils_captured ?? false,


      overspeedWarning:
        data.overspeed_warning,


      stallWarning:
        data.stall_warning,


      crashed:
        data.crashed,


      landingRate:
        data.landing_rate,


      landingDistance:
        data.landing_distance,


      glideslopeDeviation:
        data.glideslope_deviation,


      localizerDeviation:
        data.localizer_deviation,


      reverser1Deployed:
        data.reverser_1_deployed,


      reverser2Deployed:
        data.reverser_2_deployed,


      autobrakePosition:
        data.autobrake_position,


      speedbrakePosition:
        data.speedbrake_position

    };

  }

}
