const stations = Object.fromEntries([
        "Sunset",
        "Gentle Coast",
        "Spring Blossom",
        "Midsummer Loop",
        "Wetlands",
        "Flower Gardens",
        "New Haven",
        "Songbird",
        "Tadpole River",
    ].map(name => [name.toLowerCase().replace(' ', '_') ,name]));

const departures = [];

/**
 * A fake transportation service with hard-coded stations and departure schedules.
 */
class FakeTransportationService {
    /**
     * Fetches the list of stations.
     * @returns {Promise} a promise returning an object that maps station keys to their corresponding names
     */
    fetchStations() {
        return new Promise((resolve, reject) => {
            resolve(stations);
        });
    }

    /**
     * Fetches the departures for a given station key.
     * @param {string} stationKey
     * @returns {Promise} a promise that returns an array of departure objects
     */
    fetchDepartures(stationKey) {
        return new Promise((resolve, reject) => {
            resolve(departures[stationKey]);
        });
    }
}

export default FakeTransportationService;