export enum FlightPhase {

    IDLE = "IDLE",

    PREFLIGHT = "PREFLIGHT",

    TAXI = "TAXI",

    TAKEOFF = "TAKEOFF",

    CLIMB = "CLIMB",

    CRUISE = "CRUISE",

    DESCENT = "DESCENT",

    APPROACH = "APPROACH",

    LANDING = "LANDING",

    COMPLETE = "COMPLETE"

}



export class PhaseManager {


    private phase: FlightPhase =
        FlightPhase.IDLE;



    setPhase(
        phase: FlightPhase
    ) {

        this.phase = phase;

        return this.phase;

    }



    getPhase() {

        return this.phase;

    }



    processEvent(
        event: string
    ) {


        switch(event) {


            case "FLIGHT_STARTED":

                return this.setPhase(
                    FlightPhase.PREFLIGHT
                );


            case "TAXI":

                return this.setPhase(
                    FlightPhase.TAXI
                );


            case "TAKEOFF":

                return this.setPhase(
                    FlightPhase.TAKEOFF
                );


            case "CLIMB":

                return this.setPhase(
                    FlightPhase.CLIMB
                );


            case "CRUISE":

                return this.setPhase(
                    FlightPhase.CRUISE
                );


            case "DESCENT":

                return this.setPhase(
                    FlightPhase.DESCENT
                );


            case "APPROACH":

                return this.setPhase(
                    FlightPhase.APPROACH
                );


            case "LANDING":

                return this.setPhase(
                    FlightPhase.LANDING
                );


            case "FLIGHT_COMPLETE":

                return this.setPhase(
                    FlightPhase.COMPLETE
                );


            default:

                return this.phase;

        }

    }

}
