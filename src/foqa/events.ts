export enum FOQAEventType {

  HARD_LANDING = "HARD_LANDING",

  OVERSPEED = "OVERSPEED",

  EXCESSIVE_SINK_RATE = "EXCESSIVE_SINK_RATE",

  UNSTABLE_APPROACH = "UNSTABLE_APPROACH",

  HIGH_SPEED_TAXI = "HIGH_SPEED_TAXI",

  ALTITUDE_DEVIATION = "ALTITUDE_DEVIATION",

  EXCESSIVE_BANK = "EXCESSIVE_BANK"

}


export interface FOQAEvent {

  type: FOQAEventType;

  severity: "LOW" | "MEDIUM" | "HIGH";

  message: string;

  value?: number;

}


export interface FOQAData {

  airspeed?: number;

  altitude: number;

  verticalSpeed: number;

  bankAngle?: number;

  overspeedWarning?: boolean;

  landingRate?: number;

  taxiSpeed?: number;

  approachStable?: boolean;

}


export class FOQAEvents {


  detect(
    data: FOQAData
  ): FOQAEvent[] {


    const events: FOQAEvent[] = [];


    // Hard landing detection
    if (
      data.landingRate !== undefined &&
      data.landingRate < -600
    ) {

      events.push({

        type: FOQAEventType.HARD_LANDING,

        severity: "HIGH",

        message:
          "Hard landing detected",

        value:
          data.landingRate

      });

    }


    // Overspeed detection
    if (
      data.overspeedWarning === true
    ) {

      events.push({

        type: FOQAEventType.OVERSPEED,

        severity: "HIGH",

        message:
          "Aircraft overspeed detected",

        value:
          data.airspeed

      });

    }


    // Excessive sink rate
    if (
      data.verticalSpeed < -2500
    ) {

      events.push({

        type: FOQAEventType.EXCESSIVE_SINK_RATE,

        severity: "HIGH",

        message:
          "Excessive descent rate detected",

        value:
          data.verticalSpeed

      });

    }


    // Unstable approach
    if (
      data.approachStable === false
    ) {

      events.push({

        type: FOQAEventType.UNSTABLE_APPROACH,

        severity: "MEDIUM",

        message:
          "Unstable approach detected"

      });

    }


    // Taxi speed
    if (
      data.taxiSpeed !== undefined &&
      data.taxiSpeed > 30
    ) {

      events.push({

        type: FOQAEventType.HIGH_SPEED_TAXI,

        severity: "MEDIUM",

        message:
          "Excessive taxi speed detected",

        value:
          data.taxiSpeed

      });

    }


    // Bank angle
    if (
      data.bankAngle !== undefined &&
      Math.abs(data.bankAngle) > 35
    ) {

      events.push({

        type: FOQAEventType.EXCESSIVE_BANK,

        severity: "HIGH",

        message:
          "Excessive bank angle detected",

        value:
          data.bankAngle

      });

    }


    return events;

  }

}
