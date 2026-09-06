export interface CockpitResult {
  lights: number;
  levers: number;
  procedures: number;
  issues: string[];
}

export class CockpitTracker {

  private aircraft: string = "";

  private result: CockpitResult = {
    lights: 0,
    levers: 0,
    procedures: 0,
    issues: []
  };

  initialize(aircraft: string) {
    this.aircraft = aircraft;

    this.result = {
      lights: 0,
      levers: 0,
      procedures: 0,
      issues: []
    };

    console.log(
      `Cockpit tracker initialized for ${aircraft}`
    );
  }


  processEvent(event: string, data: any) {

    switch(event) {

      case "LIGHT_CHECK":
        this.checkLights(data);
        break;

      case "LEVER_CHECK":
        this.checkLevers(data);
        break;

      case "PROCEDURE_CHECK":
        this.checkProcedures(data);
        break;

      default:
        break;
    }
  }


  private checkLights(data:any) {

    if(data.beacon) {
      this.result.lights += 5;
    }
    else {
      this.result.issues.push(
        "Beacon light missing"
      );
    }


    if(data.strobe) {
      this.result.lights += 5;
    }

    if(data.landing) {
      this.result.lights += 5;
    }

    if(data.taxiOffAfterTakeoff) {
      this.result.lights += 5;
    }
  }


  private checkLevers(data:any) {

    if(data.flapsCorrect) {
      this.result.levers += 10;
    }
    else {
      this.result.issues.push(
        "Incorrect flap configuration"
      );
    }


    if(data.gearCorrect) {
      this.result.levers += 10;
    }
    else {
      this.result.issues.push(
        "Gear configuration issue"
      );
    }
  }


  private checkProcedures(data:any) {

    if(data.checklistComplete) {
      this.result.procedures += 20;
    }
    else {
      this.result.issues.push(
        "Checklist incomplete"
      );
    }

  }


  getResults(): CockpitResult {
    return this.result;
  }

}
