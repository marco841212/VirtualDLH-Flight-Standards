import type {
  FlightPhase
} from "@skyvexsoftware/stratos-sdk";

import type {
  FlightTelemetrySample
} from "./flightTelemetryAccumulator.js";


const STRATOS_PHASE = {
  TAXI: "TAXI",
  TAXI_IN: "TAXI_IN",
  APPROACH: "APPROACH",
  FINAL: "FINAL"
} as const;


function isStratosPhase(
  phase: FlightPhase,
  expected: string
) {

  return String(phase) === expected;

}


export interface FlightPhaseStatistics {

  phase: FlightPhase;

  sampleCount: number;

  durationSeconds: number;

  minimumAltitude: number;

  maximumAltitude: number;

  averageGroundSpeed: number;

  maximumGroundSpeed: number;

  maximumClimbRate: number;

  maximumSinkRate: number;

  gearDownPercent: number;

  flapsExtendedPercent: number;

  violations: string[];

}


export class FlightPhaseAnalyzer {


  analyze(
    samples: FlightTelemetrySample[]
  ): FlightPhaseStatistics[] {

    const grouped =
      new Map<
        FlightPhase,
        FlightTelemetrySample[]
      >();


    for (const sample of samples) {

      if (!sample.phase) {

        continue;

      }


      const phaseSamples =
        grouped.get(
          sample.phase
        ) ?? [];


      phaseSamples.push(
        sample
      );


      grouped.set(
        sample.phase,
        phaseSamples
      );

    }


    return Array
      .from(grouped.entries())
      .map(
        ([phase, phaseSamples]) =>
          this.analyzePhase(
            phase,
            phaseSamples
          )
      );

  }


  private analyzePhase(
    phase: FlightPhase,
    samples: FlightTelemetrySample[]
  ): FlightPhaseStatistics {

    const altitudes =
      samples.map(
        sample =>
          sample.telemetry.altitude
          ?? 0
      );


    const speeds =
      samples.map(
        sample =>
          sample.telemetry.ground_speed
          ?? 0
      );


    const verticalSpeeds =
      samples.map(
        sample =>
          sample.telemetry.vertical_speed
          ?? 0
      );


    const gearDownSamples =
      samples.filter(
        sample =>
          sample.telemetry.gear_down === true
      ).length;


    const flapsExtendedSamples =
      samples.filter(
        sample =>
          sample.telemetry.flaps_extended === true
      ).length;


    const durationSeconds =
      this.calculateDurationSeconds(
        samples
      );


    const violations =
      this.detectViolations(
        phase,
        samples
      );


    return {

      phase,

      sampleCount:
        samples.length,

      durationSeconds,

      minimumAltitude:
        Math.min(
          ...altitudes
        ),

      maximumAltitude:
        Math.max(
          ...altitudes
        ),

      averageGroundSpeed:
        this.average(
          speeds
        ),

      maximumGroundSpeed:
        Math.max(
          ...speeds
        ),

      maximumClimbRate:
        Math.max(
          ...verticalSpeeds
        ),

      maximumSinkRate:
        Math.min(
          ...verticalSpeeds
        ),

      gearDownPercent:
        this.percentage(
          gearDownSamples,
          samples.length
        ),

      flapsExtendedPercent:
        this.percentage(
          flapsExtendedSamples,
          samples.length
        ),

      violations

    };

  }


  private detectViolations(
    phase: FlightPhase,
    samples: FlightTelemetrySample[]
  ) {

    const violations =
      new Set<string>();


    /*
     * Existing VirtualDLH FOQA rule:
     * taxi speed greater than 30 knots.
     */
    if (
      isStratosPhase(
        phase,
        STRATOS_PHASE.TAXI
      ) ||
      isStratosPhase(
        phase,
        STRATOS_PHASE.TAXI_IN
      )
    ) {

      const highSpeedTaxi =
        samples.some(
          sample =>
            (
              sample.telemetry.ground_speed
              ?? 0
            ) > 30
        );


      if (highSpeedTaxi) {

        violations.add(
          "Excessive taxi speed detected"
        );

      }

    }


    /*
     * Existing VirtualDLH approach SOP:
     * descent rate below -1200 fpm.
     */
    if (
      isStratosPhase(
        phase,
        STRATOS_PHASE.APPROACH
      ) ||
      isStratosPhase(
        phase,
        STRATOS_PHASE.FINAL
      )
    ) {

      const excessiveSinkRate =
        samples.some(
          sample =>
            (
              sample.telemetry.vertical_speed
              ?? 0
            ) < -1200
        );


      if (excessiveSinkRate) {

        violations.add(
          "Excessive descent rate during approach"
        );

      }

    }


    /*
     * FINAL is authoritative Stratos final approach.
     * Gear and flaps should be configured here.
     */
    if (
      isStratosPhase(
        phase,
        STRATOS_PHASE.FINAL
      )
    ) {

      const gearNotConfigured =
        samples.some(
          sample =>
            sample.telemetry.gear_down
            !== true
        );


      if (gearNotConfigured) {

        violations.add(
          "Landing gear not configured during final approach"
        );

      }


      const flapsNotConfigured =
        samples.some(
          sample =>
            sample.telemetry.flaps_extended
            !== true
        );


      if (flapsNotConfigured) {

        violations.add(
          "Flaps not configured during final approach"
        );

      }

    }


    return [
      ...violations
    ];

  }


  private calculateDurationSeconds(
    samples: FlightTelemetrySample[]
  ) {

    if (
      samples.length < 2
    ) {

      return 0;

    }


    const first =
      Date.parse(
        samples[0].timestamp
      );


    const last =
      Date.parse(
        samples[
          samples.length - 1
        ].timestamp
      );


    return Math.max(
      0,
      Math.round(
        (last - first) / 1000
      )
    );

  }


  private average(
    values: number[]
  ) {

    if (
      values.length === 0
    ) {

      return 0;

    }


    return Math.round(
      values.reduce(
        (total, value) =>
          total + value,
        0
      ) / values.length
    );

  }


  private percentage(
    count: number,
    total: number
  ) {

    if (
      total === 0
    ) {

      return 0;

    }


    return Math.round(
      (
        count /
        total
      ) * 100
    );

  }

}
