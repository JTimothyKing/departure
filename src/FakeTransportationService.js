const stations = Object.fromEntries([
        "Sunset",
        "Gentle Coast",
        "Spring Blossom",
        "Midsummer",
        "Wetlands",
        "Flower Gardens",
        "Songbird",
        "Tadpole River",
    ].map(name => [name.toLowerCase().replace(' ', '_') ,name]));

const carriers = ['TrainCo', 'Trolley'];
function randomCarrier() {
    return carriers[ Math.floor( Math.random() * carriers.length ) ];
}

const destinations = Object.values(stations);
function randomDestination() {
    return destinations[ Math.floor( Math.random() * destinations.length ) ];
}

function randomTrain() {
    return Math.floor( Math.random() * 9900 + 100 );
}

function randomTrack() {
    return String.fromCharCode( Math.floor( Math.random() * 5 + 'A'.charCodeAt(0) ) );
}

const departures = Object.fromEntries(Object.keys(stations).map(station => {
    const numStationDepartures = Math.floor( Math.random() * 7 + 3 );

    const stationDepartures = [];
    for (let i = 0; i < numStationDepartures; i++) {
        const departure_time = new Date( Date.now() + Math.random() * 12*3600*1000 );
        stationDepartures.push(
            {
                carrier: randomCarrier(),
                arrival_time: departure_time,
                departure_time: departure_time,
                destination: randomDestination(),
                train: randomTrain(),
                track: randomTrack(),
                status: 'On time',
            },
        );
    }

    return [station, stationDepartures];
}));

/**
 * A fake transportation service with hard-coded stations and random departure schedules.
 */
class FakeTransportationService {
    /**
     * Fetches the list of stations.
     * @returns {Promise} a promise returning an object that maps station keys to their corresponding names
     */
    async fetchStations() {
        return new Promise((resolve, reject) => {
            resolve(stations);
        });
    }

    /**
     * Fetches the departures for a given station key.
     * @param {string} stationKey
     * @returns {Promise} a promise that returns an array of departure objects
     */
    async fetchDepartures(stationKey) {
        return new Promise((resolve, reject) => {
            resolve(departures[stationKey] || []);
        });
    }
}

export default FakeTransportationService;