export function mapAircraft(simAircraft) {
    const aircraft = simAircraft.toUpperCase();
    if (aircraft.includes("A350"))
        return "A350";
    if (aircraft.includes("B777"))
        return "B777";
    if (aircraft.includes("B787"))
        return "B787";
    if (aircraft.includes("A330"))
        return "A330";
    return "UNKNOWN";
}
//# sourceMappingURL=aircraft.js.map