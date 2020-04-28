import React from 'react';
import { render } from '@testing-library/react';
import { waitFor } from "@testing-library/dom";
import DepartureBoard from './DepartureBoard';

class TestTransportationService {
  #stations;
  #departures;

  constructor(stations, departuresByStationKey) {
    this.#stations = stations ?? [];
    this.#departures = departuresByStationKey ?? {};

    this.fetchStations = jest.fn(this.fetchStations);
    this.fetchDepartures = jest.fn(this.fetchDepartures);
  }

  /**
   * Fetches the list of stations.
   * @returns {Promise} a promise returning an object that maps station keys to their corresponding names
   */
  fetchStations() {
    return new Promise((resolve, reject) => {
      resolve(this.#stations);
    });
  }

  /**
   * Fetches the departures for a given station key.
   * @param {string} stationKey
   * @returns {Promise} a promise that returns an array of departure objects
   */
  fetchDepartures(stationKey) {
    return new Promise((resolve, reject) => {
      resolve(this.#departures[stationKey]);
    });
  }
}

test('fetches stations', async () => {
  const stations = {
    "station1": "First Station",
    "station2": "Second Station",
  };
  const transportationService = new TestTransportationService(stations);

  const { getByText, getByDisplayValue } = render(<DepartureBoard transportationService={transportationService} />);

  await waitFor(() => {
    expect(transportationService.fetchStations).toHaveBeenCalled();
  });

  const stationSelect = getByDisplayValue(/select a station/i, {selector: 'select'});
  expect(stationSelect).toBeEnabled();

  const expectedChildren = [
      // [key, name, isSelected],
      ["", "Select a station...", true],
      ...(Object.entries(stations)
          .map(s => [s[0], s[1], false])
          .sort((a, b) => a[1].localeCompare(b[1])))
  ];

  stationSelect.childNodes.forEach((node, idx) => {
    const [key, name, isSelected] = expectedChildren[idx];
    expect(node).toBeInstanceOf(HTMLOptionElement);
    expect(node.value).toBe(key);
    expect(node.text).toBe(name);
    expect(node.selected).toBe(isSelected);
  });
});
