export class CockpitTracker {
    constructor() {
        this.aircraft = "";
        this.result = {
            lights: 0,
            levers: 0,
            procedures: 0,
            issues: []
        };
    }
    initialize(aircraft) {
        this.aircraft = aircraft;
        this.result = {
            lights: 0,
            levers: 0,
            procedures: 0,
            issues: []
        };
        console.log(`Cockpit tracker initialized for ${aircraft}`);
    }
    processEvent(event, data) {
        switch (event) {
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
    checkLights(data) {
        if (data.beacon) {
            this.result.lights += 5;
        }
        else {
            this.result.issues.push("Beacon light missing");
        }
        if (data.strobe) {
            this.result.lights += 5;
        }
        if (data.landing) {
            this.result.lights += 5;
        }
        if (data.taxiOffAfterTakeoff) {
            this.result.lights += 5;
        }
    }
    checkLevers(data) {
        if (data.flapsCorrect) {
            this.result.levers += 10;
        }
        else {
            this.result.issues.push("Incorrect flap configuration");
        }
        if (data.gearCorrect) {
            this.result.levers += 10;
        }
        else {
            this.result.issues.push("Gear configuration issue");
        }
    }
    checkProcedures(data) {
        if (data.checklistComplete) {
            this.result.procedures += 20;
        }
        else {
            this.result.issues.push("Checklist incomplete");
        }
    }
    getResults() {
        return this.result;
    }
}
//# sourceMappingURL=tracker.js.map