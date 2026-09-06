import { FlightEventBridge } from "./eventBridge.js";
import { VirtualDLHStratosRuntime } from "../stratos/runtime.js";


export class RuntimeConnector {


    private bridge: FlightEventBridge;

    private runtime: VirtualDLHStratosRuntime;



    constructor(
        runtime: VirtualDLHStratosRuntime
    ) {

        this.bridge =
            new FlightEventBridge();


        this.runtime =
            runtime;

    }



    send(
        event: string,
        data?: any
    ) {


        const flightEvent =
            this.bridge.emit(
                event,
                data
            );


        this.runtime.handleEvent(
            event,
            flightEvent
        );


        return flightEvent;

    }



    history() {

        return this.bridge.getEvents();

    }

}
