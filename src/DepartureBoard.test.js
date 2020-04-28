import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import { waitFor } from "@testing-library/dom";
import DepartureBoard from './DepartureBoard';

class TestTransportationService {
  #stations;
  #departures;

  constructor(stations, departuresByStationKey) {
    this.#stations = stations ?? {};
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

  const { getByDisplayValue } = render(<DepartureBoard transportationService={transportationService} />);

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

test('displays departures', async () => {
  const stations = {
    "station1": "First Station",
  };
  const departures = {
    "station1": [
      {
        carrier: "Trolley",
        arrival_time: null,
        departure_time: new Date(2020, 3, 28, 13, 28, 0, 0),
        destination: "Next stop",
        train: 101,
        track: "R",
        status: "Approaching",
      },
      {
        carrier: "TrainCo",
        arrival_time: new Date(2020, 3, 28, 15, 0, 0, 0),
        departure_time: new Date(2020, 3, 28, 15, 0, 0, 0),
        destination: "Anytown, USA",
        train: 1234,
        track: "Q",
        status: "On time",
      },
      {
        carrier: "TrainCo",
        arrival_time: new Date(2020, 3, 28, 17, 0, 0, 0),
        departure_time: new Date(2020, 3, 28, 17, 0, 0, 0),
        destination: "This Place",
        train: 567,
        track: "Q",
        status: "On time",
      },
    ],
  }

  const transportationService = new TestTransportationService(stations, departures);

  const { getByText, getByDisplayValue } = render(<DepartureBoard transportationService={transportationService} />);

  await waitFor(() => {
    expect(transportationService.fetchStations).toHaveBeenCalled();
  });

  const stationSelect = getByDisplayValue(/select a station/i, {selector: 'select'});
  expect(stationSelect).toBeEnabled();

  stationSelect.value = 'station1';
  fireEvent.change(stationSelect);

  await waitFor(() => {
    expect(transportationService.fetchDepartures).toHaveBeenCalled();
  });

  const destinationHeader = getByText(/destination/i, {selector: 'th'});
  const departuresTable = destinationHeader.closest('table');

  const expectedRows = [
      // [carrier, time, destination, train, track, status]
      ["Trolley", "1:28:00 PM", "Next stop", "101", "R", "Approaching"],
      ["TrainCo", "3:00:00 PM", "Anytown, USA", "1234", "Q", "On time"],
      ["TrainCo", "5:00:00 PM", "This Place", "567", "Q", "On time"],
  ];

  departuresTable.querySelector('tbody').childNodes.forEach((rowNode, idxRow) => {
    const expectedRow = expectedRows[idxRow];
    expect(rowNode).toBeInstanceOf(HTMLTableRowElement);
    rowNode.childNodes.forEach((dataNode, idxData) => {
      expect(dataNode).toBeInstanceOf(HTMLTableCellElement);
      expect(dataNode.textContent).toBe(expectedRow[idxData]);
    });
  });
});
