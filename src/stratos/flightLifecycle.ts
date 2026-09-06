import { StratosEvents } from "./events.js";
import { PhaseManager } from "../simulator/phaseManager.js";
import { FlightEventBridge } from "../simulator/eventBridge.js";
import { PhaseScoreMapper } from "../scoring/phaseScoreMapper.js";
import { FlightSummaryBuilder } from "../reports/flightSummary.js";


export class FlightLifecycle {


    private events: FlightEventBridge;

    private phases: PhaseManager;

    private scoring: PhaseScoreMapper;

    private summary: FlightSummaryBuilder;



    constructor() {

        this.events =
            new FlightEventBridge();


        this.phases =
            new PhaseManager();


        this.scoring =
            new PhaseScoreMapper();


        this.summary =
            new FlightSummaryBuilder();

    }



    process(
        event: string,
        data?: any
    ) {


        const flightEvent =
            this.events.emit(
                event,
                data
            );


        const phase =
            this.phases.processEvent(
                event
            );


        const score =
            this.scoring.evaluate(
                phase
            );


        return {

            event: flightEvent,

            phase,

            score

        };

    }



    complete(
        pilot: string,
        flight: string,
        aircraft: string
    ) {


        const phases =
            this.events
                .getEvents()
                .map(item =>
                    this.scoring.evaluate(
                        this.phases.processEvent(
                            item.type
                        )
                    )
                );


        return this.summary.create(
            pilot,
            flight,
            aircraft,
            phases
        );

    }



}
