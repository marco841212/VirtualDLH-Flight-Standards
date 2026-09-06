import { CockpitTracker } from "./cockpit/tracker.js";
import { ScoringEngine } from "./scoring/scoringEngine.js";
import { VirtualDLHStratosRuntime } from "./stratos/runtime.js";


export class VirtualDLHFlightStandards {


    private cockpit: CockpitTracker;

    private scoring: ScoringEngine;

    private stratos: VirtualDLHStratosRuntime;



    constructor() {

        this.cockpit =
            new CockpitTracker();


        this.scoring =
            new ScoringEngine();


        this.stratos =
            new VirtualDLHStratosRuntime({});

    }



    async start() {

        await this.stratos.start();


        console.log(
            "VirtualDLH Flight Standards Started"
        );

    }



    async stop() {

        await this.stratos.stop();


        console.log(
            "VirtualDLH Flight Standards Stopped"
        );

    }


processEvent(
    event: string,
    data: any
) {

    this.stratos.handleEvent(
        event,
        data
    );


    this.cockpit.check();

}
    



    getFlightScore() {

        return this.scoring.getScore();

    }

}



export default VirtualDLHFlightStandards;
