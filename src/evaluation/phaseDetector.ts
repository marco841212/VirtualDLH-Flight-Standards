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
  TAXI_IN = "TAXI_IN"
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
     * Taxi operations
     */
    if (
      data.onGround &&
      data.groundSpeed >= 5 &&
      data.groundSpeed < 40
    ) {

      return FlightPhase.TAXI_OUT;

    }


    /*
     * Takeoff roll
     */
    if (
      data.onGround &&
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
     * Landing
     */
    if (
      data.onGround &&
      data.groundSpeed < 80 &&
      data.gearDown === true
    ) {

      return FlightPhase.LANDING;

    }


    /*
     * Default
     */
    return FlightPhase.CRUISE;

  }

}
