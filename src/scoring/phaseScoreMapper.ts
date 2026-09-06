
import { FlightPhase } from "../simulator/phaseManager.js";


export interface PhaseScore {

    phase: FlightPhase;

    score: number;

    notes: string[];

}


export class PhaseScoreMapper {


    evaluate(
        phase: FlightPhase
    ): PhaseScore {

        switch (phase) {

            case FlightPhase.TAKEOFF:
                return {
                    phase,
                    score: 100,
                    notes: [
                        "Takeoff phase recorded"
                    ]
                };


            case FlightPhase.CLIMB:
                return {
                    phase,
                    score: 100,
                    notes: [
                        "Climb profile recorded"
                    ]
                };


            case FlightPhase.CRUISE:
                return {
                    phase,
                    score: 100,
                    notes: [
                        "Cruise phase recorded"
                    ]
                };


            case FlightPhase.APPROACH:
                return {
                    phase,
                    score: 100,
                    notes: [
                        "Approach phase recorded"
                    ]
                };


            case FlightPhase.LANDING:
                return {
                    phase,
                    score: 100,
                    notes: [
                        "Landing phase recorded"
                    ]
                };


            default:
                return {
                    phase,
                    score: 0,
                    notes: [
                        "No scoring rules assigned"
                    ]
                };
        }

    }

}
