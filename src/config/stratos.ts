export const StratosConfig = {

    baseURL:
        "https://crew.virtualdlh.com/api/stratos",

    headers: {
        "Content-Type": "application/json"
    },

    endpoints: {

        verify: "/pilot/verify",

        aircraft: "/data/aircraft",

        airports: "/data/airports",

        announcements: "/data/announcements",

        startFlight: "/flights/start",

        updateFlight: "/flights/update",

        completeFlight: "/flights/complete",

        cancelFlight: "/flights/cancel"
    }

};
