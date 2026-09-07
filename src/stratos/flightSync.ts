import { FlightEvaluator } from "../evaluation/flightEvaluator.js";
import { TelemetryAdapter } from "./telemetryAdapter.js";


export class FlightSync {


  private evaluator: FlightEvaluator;

  private adapter: TelemetryAdapter;



  constructor() {

    this.evaluator = new FlightEvaluator();

    this.adapter = new TelemetryAdapter();

  }



  async processFlight(
    flightId: string
  ) {


    const telemetry = {


      altitude: 35000,

      ground_speed: 280,

      vertical_speed: 0,

      on_ground: false,

      gear_down: false,

      flaps_extended: false,

      ils_captured: false


    };



    const flightTelemetry =
      this.adapter.convert(
        telemetry
      );


    const evaluation =
      this.evaluator.evaluate(
        flightTelemetry
      );



    return {

      flightId,

      evaluation

    };


  }



  async completeFlight(
    flightId: string
  ) {


    return {

      success: true,

      flightId

    };

  }


}
