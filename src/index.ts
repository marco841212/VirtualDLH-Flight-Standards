import { CockpitTracker } from "./cockpit/tracker";
import { ScoringEngine } from "./scoring/engine";

export interface StratosPluginContext {
  flightId: string;
  aircraft: string;
  phase: string;
}

export class VirtualDLHCockpitStandardsPlugin {

  private cockpit: CockpitTracker;
  private scoring: ScoringEngine;

  constructor() {
    this.cockpit = new CockpitTracker();
    this.scoring = new ScoringEngine();
  }

  onFlightStart(context: StratosPluginContext) {
    console.log(
      "VirtualDLH Cockpit Standards started",
      context.flightId
    );

    this.cockpit.initialize(context.aircraft);
  }

  onFlightEvent(event: string, data: unknown) {

    this.cockpit.processEvent(event, data);

    this.scoring.evaluate(
      event,
      this.cockpit.getResults()
    );
  }

  getReport() {
    return {
      cockpit: this.cockpit.getResults(),
      score: this.scoring.getScore()
    };
  }
}

export default VirtualDLHCockpitStandardsPlugin;
