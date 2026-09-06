export interface FlightEvent {

    type: string;

    timestamp: string;

    data?: any;

}



export class FlightEventBridge {


    private events: FlightEvent[] = [];



    emit(
        type: string,
        data?: any
    ) {

        const event: FlightEvent = {

            type,

            timestamp:
                new Date().toISOString(),

            data

        };


        this.events.push(event);


        return event;

    }



    getEvents() {

        return this.events;

    }



    latest() {

        return this.events[
            this.events.length - 1
        ];

    }



    clear() {

        this.events = [];

    }

}
