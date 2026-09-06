import { StratosClient } from "./client.js";
import { StratosEvents } from "./events.js";


export interface StratosRuntimeContext {
    logger?: {
        info(message: string): void;
        error(message: string): void;
    };

    token?: string;
}


export class VirtualDLHStratosRuntime {

    private client: StratosClient;
    private running = false;


    constructor(
        context: StratosRuntimeContext
    ) {

        this.client =
            new StratosClient(
                context.token
            );

    }


    async start() {

        this.running = true;

        console.log(
            "VirtualDLH Stratos Runtime Started"
        );

    }


    async stop() {

        this.running = false;

        console.log(
            "VirtualDLH Stratos Runtime Stopped"
        );

    }


    handleEvent(
        event: string,
        data: any
    ) {

        if (!this.running) {
            return;
        }


        switch(event) {

            case StratosEvents.STARTED:

                console.log(
                    "Flight Started",
                    data
                );

                break;


            case StratosEvents.TAKEOFF:

                console.log(
                    "Takeoff Recorded"
                );

                break;


            case StratosEvents.LANDING:

                console.log(
                    "Landing Recorded"
                );

                break;


            case StratosEvents.COMPLETE:

                console.log(
                    "Flight Complete"
                );

                break;

        }

    }

}
