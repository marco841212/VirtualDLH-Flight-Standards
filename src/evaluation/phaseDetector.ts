export enum FlightPhase {
  PARKED = "PARKED",
  TAXI_OUT = "TAXI_OUT",
  TAKEOFF_ROLL = "TAKEOFF_ROLL",
  INITIAL_CLIMB = "INITIAL_CLIMB",
  CLIMB = "CLIMB",
  CRUISE = "CRUISE",
  DESCENT = "DESCENT",
  APPROACH = "APPROACH",
  LANDING = "LANDING",
  TAXI_IN = "TAXI_IN",
  UNKNOWN = "UNKNOWN"
}


export interface FlightTelemetry {

  altitude: number;

  altitudeAgl?: number;

  cruiseAltitude?: number;

  groundSpeed: number;

  indicatedAirspeed?: number;

  verticalSpeed: number;

  bankAngle?: number;

  pitch?: number;

  onGround: boolean;

  gearDown?: boolean;

  flapsExtended?: boolean;

  ilsCaptured?: boolean;

  overspeedWarning?: boolean;

  stallWarning?: boolean;

  crashed?: boolean;

  landingRate?: number;

  landingDistance?: number;

  glideslopeDeviation?: number;

  localizerDeviation?: number;

  reverser1Deployed?: boolean;

  reverser2Deployed?: boolean;

  autobrakePosition?: number;

  speedbrakePosition?: number;

}


export class PhaseDetector {


  detect(
    data: FlightTelemetry
  ): FlightPhase {


    const landingRateEvidence =
      data.landingRate !== undefined &&
      Number.isFinite(data.landingRate) &&
      data.landingRate !== 0;


    const landingDistanceEvidence =
      data.landingDistance !== undefined &&
      Number.isFinite(data.landingDistance) &&
      data.landingDistance > 0;


    const landingEvidence =
      landingRateEvidence ||
      landingDistanceEvidence ||
      data.reverser1Deployed === true ||
      data.reverser2Deployed === true;


    /*
     * Aircraft stationary
     */
    if (
      data.onGround &&
      data.groundSpeed < 5
    ) {

      return FlightPhase.PARKED;

    }


    /*
     * Taxi in after touchdown
     */
    if (
      data.onGround &&
      landingEvidence &&
      data.groundSpeed >= 5 &&
      data.groundSpeed < 40
    ) {

      return FlightPhase.TAXI_IN;

    }


    /*
     * Taxi out before takeoff
     */
    if (
      data.onGround &&
      !landingEvidence &&
      data.groundSpeed >= 5 &&
      data.groundSpeed < 40
    ) {

      return FlightPhase.TAXI_OUT;

    }


    /*
     * Landing rollout
     */
    if (
      data.onGround &&
      landingEvidence &&
      data.groundSpeed >= 40
    ) {

      return FlightPhase.LANDING;

    }


    /*
     * Takeoff roll
     */
    if (
      data.onGround &&
      !landingEvidence &&
      data.groundSpeed >= 40
    ) {

      return FlightPhase.TAKEOFF_ROLL;

    }


    /*
     * Initial climb
     */
    if (
      !data.onGround &&
      data.altitude < 10000 &&
      data.verticalSpeed > 500
    ) {

      return FlightPhase.INITIAL_CLIMB;

    }


    /*
     * Climb
     */
    if (
      data.verticalSpeed > 500 &&
      data.altitude < 30000
    ) {

      return FlightPhase.CLIMB;

    }


    /*
     * Cruise
     */
    if (
      data.altitude >= 30000 &&
      Math.abs(data.verticalSpeed) < 300
    ) {

      return FlightPhase.CRUISE;

    }


    /*
     * Descent
     */
    if (
      data.verticalSpeed < -500 &&
      data.altitude > 5000
    ) {

      return FlightPhase.DESCENT;

    }


    /*
     * Approach
     */
    if (
      data.ilsCaptured === true &&
      data.gearDown === true
    ) {

      return FlightPhase.APPROACH;

    }


    /*
     * Unknown fallback — do not assume cruise
     */
    return FlightPhase.UNKNOWN;

  }

}
