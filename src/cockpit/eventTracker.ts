export interface CockpitEvent {

    event: string;

    timestamp: Date;

    data?: any;

}



export class CockpitEventTracker {


    private events: CockpitEvent[] = [];



    record(
        event: string,
        data?: any
    ) {

        const cockpitEvent: CockpitEvent = {

            event,

            timestamp: new Date(),

            data

        };


        this.events.push(
            cockpitEvent
        );


        return cockpitEvent;

    }



    getEvents() {

        return this.events;

    }



    clear() {

        this.events = [];

    }

}
