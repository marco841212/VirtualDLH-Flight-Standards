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


        if (!result.success) {

          ctx.logger.info(
            "VirtualDLH Flight Standards",
            `Evaluation skipped: ${result.error ?? "Unknown evaluation error"}`
          );

          return;

        }


        const evaluation =
          result.evaluation as any;


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
            `${evaluationLabel}: phase=${evaluation.phase ?? "UNKNOWN"} score=${score ?? 0} rating=${evaluation.rating ?? "PENDING"} foqa=${evaluation.foqaScore ?? 0} violations=${violations} exceedances=${exceedances} complete=${evaluation.evaluationComplete === true}`
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
