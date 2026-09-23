import { createPlugin } from "@skyvexsoftware/stratos-sdk/helpers";

import {
  PluginRuntime
} from "../core/pluginRuntime.js";


export const runtime =
  new PluginRuntime();


const LIVE_EVALUATION_INTERVAL_MS =
  30_000;

const LANDING_EVALUATION_DELAY_MS =
  750;


function formatLightStatus(
  status: any
) {

  const value = (
    key: string
  ) => {

    const state =
      status?.[key];

    return typeof state === "boolean"
      ? state ? "ON" : "OFF"
      : "N/A";

  };


  return [
    `beacon=${value("beacon")}`,
    `strobe=${value("strobe")}`,
    `landing=${value("landing")}`,
    `taxi=${value("taxi")}`,
    `nav=${value("navigation")}`
  ].join(",");

}


let evaluationTimer:
  ReturnType<typeof setInterval> | null = null;

let landingEvaluationTimer:
  ReturnType<typeof setTimeout> | null = null;

let unsubscribeLanding:
  (() => void) | null = null;

let evaluationInProgress =
  false;

let liveFlightId:
  string | null = null;

let lastEvaluationSignature:
  string | null = null;


let lightDiagnosticsLogged =
  false;


function clearLiveEvaluationHooks() {

  if (evaluationTimer) {

    clearInterval(
      evaluationTimer
    );

    evaluationTimer =
      null;

  }


  if (landingEvaluationTimer) {

    clearTimeout(
      landingEvaluationTimer
    );

    landingEvaluationTimer =
      null;

  }


  if (unsubscribeLanding) {

    unsubscribeLanding();

    unsubscribeLanding =
      null;

  }


  evaluationInProgress =
    false;

  liveFlightId =
    null;

  lastEvaluationSignature =
    null;

  lightDiagnosticsLogged =
    false;

}


export default createPlugin({

  async onStart(ctx) {

    clearLiveEvaluationHooks();


    ctx.logger.info(
      "VirtualDLH Flight Standards",
      "Starting live Stratos telemetry connection"
    );


    await runtime.connectStratosFlight(
      ctx.flight
    );


    liveFlightId =
      `stratos-live-${Date.now()}`;


    const runEvaluation = async (
      landingTriggered: boolean
    ) => {

      if (
        evaluationInProgress ||
        !liveFlightId ||
        !runtime.hasLiveStratosTelemetry()
      ) {

        return;

      }


      evaluationInProgress =
        true;


      try {

        const result =
          await runtime.evaluateFlight({
            flightId:
              liveFlightId
          });


        const evaluationResult =
          result as any;


        if (!evaluationResult.success) {

          ctx.logger.info(
            "VirtualDLH Flight Standards",
            `Evaluation skipped: ${evaluationResult.error ?? "Unknown evaluation error"}`
          );

          return;

        }


        const evaluation =
          evaluationResult.evaluation as any;


        const score =
          typeof evaluation.provisionalScore === "number"
            ? evaluation.provisionalScore
            : evaluation.score;


        const violations =
          Array.isArray(
            evaluation.violations
          )
            ? evaluation.violations.length
            : 0;


        const exceedances =
          Array.isArray(
            evaluation.exceedances
          )
            ? evaluation.exceedances.length
            : 0;


        const lightEvents =
          Array.isArray(
            evaluation.lightEvents
          )
            ? evaluation.lightEvents.length
            : 0;


        const lightStatus =
          formatLightStatus(
            evaluation.lightStatus
          );


        if (!lightDiagnosticsLogged) {

          const diagnostics =
            runtime.getLightTelemetryDiagnostics();

          if (diagnostics) {

            const nested =
              Object.entries(
                diagnostics.nestedLightKeys
              )
                .map(
                  ([key, keys]) =>
                    `${key}=[${keys.join(",")}]`
                )
                .join(";");

            ctx.logger.info(
              "VirtualDLH Flight Standards",
              `Light telemetry diagnostic: topLevelKeys=[${diagnostics.topLevelKeys.join(",")}] lightLikeKeys=[${diagnostics.lightLikeKeys.join(",") || "NONE"}] nested=[${nested || "NONE"}]`
            );

            lightDiagnosticsLogged =
              true;

          }

        }


        const signature = [
          String(
            evaluation.phase
            ?? "UNKNOWN"
          ),
          String(
            score
            ?? 0
          ),
          String(
            evaluation.rating
            ?? "PENDING"
          ),
          String(
            violations
          ),
          String(
            exceedances
          ),
          String(
            evaluation.evaluationComplete
            ?? false
          ),
          lightStatus,
          String(
            lightEvents
          )
        ].join(
          "|"
        );


        if (
          landingTriggered ||
          signature !== lastEvaluationSignature
        ) {

          const evaluationLabel =
            landingTriggered
              ? "Landing evaluation"
              : "Live evaluation";


          ctx.logger.info(
            "VirtualDLH Flight Standards",
            `${evaluationLabel}: phase=${evaluation.phase ?? "UNKNOWN"} score=${score ?? 0} rating=${evaluation.rating ?? "PENDING"} foqa=${evaluation.foqaScore ?? 0} violations=${violations} exceedances=${exceedances} complete=${evaluation.evaluationComplete === true} lights=[${lightStatus}] lightEvents=${lightEvents}`
          );


          lastEvaluationSignature =
            signature;

        }

      } catch (error) {

        ctx.logger.info(
          "VirtualDLH Flight Standards",
          `Evaluation error: ${error instanceof Error ? error.message : "Unknown error"}`
        );

      } finally {

        evaluationInProgress =
          false;

      }

    };


    unsubscribeLanding =
      ctx.flight.onLanding(
        () => {

          if (landingEvaluationTimer) {

            clearTimeout(
              landingEvaluationTimer
            );

          }


          landingEvaluationTimer =
            setTimeout(
              () => {

                void runEvaluation(
                  true
                );

              },
              LANDING_EVALUATION_DELAY_MS
            );

        }
      );


    evaluationTimer =
      setInterval(
        () => {

          void runEvaluation(
            false
          );

        },
        LIVE_EVALUATION_INTERVAL_MS
      );


    await runEvaluation(
      false
    );


    ctx.logger.info(
      "VirtualDLH Flight Standards",
      "Live Stratos telemetry connected"
    );


    ctx.logger.info(
      "VirtualDLH Flight Standards",
      "Live scoring armed: provisional evaluation every 30 seconds and landing-triggered evaluation enabled"
    );

  },


  async onStop(ctx) {

    clearLiveEvaluationHooks();

    runtime.disconnectStratosFlight();

    ctx.logger.info(
      "VirtualDLH Flight Standards",
      "Stratos telemetry disconnected"
    );

  }

});
