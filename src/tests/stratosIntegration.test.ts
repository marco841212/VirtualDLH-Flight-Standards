import assert from "node:assert/strict";

import type {
  PluginFlightAccessor
} from "@skyvexsoftware/stratos-sdk";

import {
  PluginRuntime
} from "../core/pluginRuntime.js";


type Handler =
  (payload: any) => void;


function requireHandler(
  handler: Handler | null,
  message: string
): Handler {

  assert.ok(
    handler,
    message
  );

  return handler as Handler;

}


async function runStratosIntegrationTest() {

  let phaseHandler:
    Handler | null = null;

  let landingHandler:
    Handler | null = null;

  let simDataHandler:
    Handler | null = null;

  let phaseUnsubscribed =
    false;

  let landingUnsubscribed =
    false;

  let simDataUnsubscribed =
    false;


  const flight = {

    async getPhase() {

      return {
        currentPhase: "CRUISE"
      };

    },


    async getLandingReport() {

      return {
        landingAnalysis: null
      };

    },


    async getSnapshot() {

      return null;

    },


    onPhaseChange(
      handler: Handler
    ) {

      phaseHandler =
        handler;

      return () => {
        phaseUnsubscribed = true;
      };

    },


    onLanding(
      handler: Handler
    ) {

      landingHandler =
        handler;

      return () => {
        landingUnsubscribed = true;
      };

    },


    onSimData(
      handler: Handler
    ) {

      simDataHandler =
        handler;

      return () => {
        simDataUnsubscribed = true;
      };

    }

  } as unknown as PluginFlightAccessor;


  const runtime =
    new PluginRuntime();


  await runtime.connectStratosFlight(
    flight
  );


  assert.equal(
    runtime.hasLiveStratosTelemetry(),
    false,
    "Live telemetry should remain unavailable until a connected simulator frame arrives"
  );


  const emitPhase =
    requireHandler(
      phaseHandler,
      "Phase change subscription should be registered"
    );

  const emitLanding =
    requireHandler(
      landingHandler,
      "Landing subscription should be registered"
    );

  const emitSimData =
    requireHandler(
      simDataHandler,
      "Simulator data subscription should be registered"
    );


  emitSimData({
    isConnected: false,
    data: {
      altitude: 20000
    }
  });


  assert.equal(
    runtime.hasLiveStratosTelemetry(),
    false,
    "Disconnected simulator frames must be ignored"
  );


  emitSimData({
    isConnected: true,
    data: {
      altitude: 20000,
      altitudeAgl: 19000,
      cruiseAltitude: 20000,
      groundSpeed: 430,
      indicatedAirspeed: 280,
      verticalSpeed: 0,
      bank: 0,
      pitch: 2,
      planeOnground: false,
      gearControl: false,
      flapsControl: 0,
      flapsLeftPosition: 0,
      flapsRightPosition: 0,
      overspeedWarning: false,
      stallWarning: false,
      crashed: false,
      landingRate: 0,
      landingDistance: 0,
      glideslopeDeviation: 0,
      localizerDeviation: 0,
      reverser1Deployed: false,
      reverser2Deployed: false,
      autobrakePosition: 0,
      speedbrakePosition: 0
    }
  });


  assert.equal(
    runtime.hasLiveStratosTelemetry(),
    true,
    "Connected simulator frame should become live telemetry"
  );


  const lightDiagnostics =
    runtime.getLightTelemetryDiagnostics();

  assert.ok(
    lightDiagnostics,
    "Connected simulator frame should expose telemetry diagnostics"
  );

  assert.ok(
    lightDiagnostics.topLevelKeys.includes(
      "altitude"
    ),
    "Telemetry diagnostics should list actual FlightData keys"
  );

  assert.deepEqual(
    lightDiagnostics.lightLikeKeys,
    [],
    "A frame without light fields should explicitly report no light-like keys"
  );


  const request = {
    flightId: "DLH-LIVE-TEST",
    pilotName: "VirtualDLH Integration Test Pilot",
    flightNumber: "DLH400",
    aircraft: "A350-900",
    route: "EDDF-KJFK"
  };


  const pendingResult =
    await runtime.evaluateFlight(
      request
    ) as any;


  assert.equal(
    pendingResult.success,
    true,
    "Live Stratos telemetry should reach StandardsController"
  );


  assert.equal(
    pendingResult.evaluation.phase,
    "CRUISE",
    "Authoritative Stratos phase should override ambiguous fallback telemetry"
  );


  assert.equal(
    pendingResult.evaluation.rating,
    "PENDING",
    "Flight should remain pending before landing analysis is available"
  );


  assert.equal(
    pendingResult.evaluation.phaseStatistics.length,
    1,
    "Live telemetry sample should reach the phase analyzer"
  );


  assert.equal(
    pendingResult.evaluation.phaseStatistics[0].phase,
    "CRUISE",
    "Telemetry history should retain the authoritative Stratos phase"
  );


  assert.equal(
    pendingResult.evaluation.phaseStatistics[0].sampleCount,
    1,
    "The first connected simulator frame should be accumulated"
  );


  emitPhase({
    currentPhase: "FINAL"
  });


  emitLanding({
    landingAnalysis: {
      landingRateFpm: -180,
      landingDistanceFt: 800,
      approachAltitude: 1000,
      approachIas: 145,
      approachVs: -700,
      touchdownFlapsIndex: 3,
      bounceCount: 0,
      gateCapture: {
        altitudeAgl: 1000,
        indicatedAirspeed: 145,
        verticalSpeed: -700,
        bank: 3
      }
    }
  });


  const completedResult =
    await runtime.evaluateFlight(
      request
    ) as any;


  assert.equal(
    completedResult.success,
    true,
    "Evaluation should remain successful after landing data arrives"
  );


  assert.equal(
    completedResult.evaluation.phase,
    "FINAL",
    "Phase change events should update the authoritative phase"
  );


  assert.equal(
    completedResult.evaluation.evaluationComplete,
    true,
    "Landing analysis should complete approach and landing evaluation"
  );


  assert.equal(
    typeof completedResult.evaluation.approachScore,
    "number",
    "Completed evaluation should include an approach score"
  );


  assert.equal(
    typeof completedResult.evaluation.landingScore,
    "number",
    "Completed evaluation should include a landing score"
  );


  assert.notEqual(
    completedResult.evaluation.rating,
    "PENDING",
    "Completed evaluation should receive a final rating"
  );


  runtime.disconnectStratosFlight();


  assert.equal(
    runtime.hasLiveStratosTelemetry(),
    false,
    "Disconnect should remove the active Stratos bridge"
  );


  assert.equal(
    phaseUnsubscribed,
    true,
    "Phase subscription should be cleaned up"
  );


  assert.equal(
    landingUnsubscribed,
    true,
    "Landing subscription should be cleaned up"
  );


  assert.equal(
    simDataUnsubscribed,
    true,
    "Simulator data subscription should be cleaned up"
  );


  console.log(
    "Stratos live integration test passed."
  );

}


runStratosIntegrationTest()
  .catch(
    error => {

      console.error(error);
      process.exit(1);

    }
  );