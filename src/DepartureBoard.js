import React from 'react';
import './DepartureBoard.css';

function Station(props) {
  return <select onChange={props.onChange}>
      <option key="" value="">Select a station...</option>
      {
          Object.entries(props.children)
              .sort(([,nameA], [,nameB]) => nameA.localeCompare(nameB))
              .map(([key, name]) => <option key={key} value={key}>{name}</option>)
      }
  </select>;
}

const columns = ['carrier', 'departure_time', 'destination', 'train', 'track', 'status'];
const column_names = ['Carrier', 'Time', 'Destination', 'Train#', 'Track#', 'Status'];

function format_column_value(col, value) {
  if (! value) return '';

  switch (col) {
    case 'departure_time':
    case 'arrival_time':
      return value.toLocaleTimeString();

    default:
      return value;
  }
}

function Departures(props) {
  return <table>
    <thead><tr>{column_names.map(name => <th key={name}>{name}</th>)}</tr></thead>
    <tbody>
      {props.children.map(departure => <tr key={departure.train}>
        {columns.map(col => <td key={col}>{format_column_value(col, departure[col])}</td>)}
      </tr>)}
    </tbody>
  </table>;
}

class DepartureBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stations: {},
      selectedStation: "",
      departures: [],
    };

    this.handleStationChange = this.handleStationChange.bind(this);

    this.props.transportationService
        .fetchStations()
        .then(this.setStations.bind(this));
  }

  setStations(stations) {
    this.setState({stations});
  }

  setDepartures(departures) {
    this.setState({departures});
  }

  handleStationChange(e) {
    const selectedStation = e.target.value;
    this.setState({selectedStation},
        () => {
          this.props.transportationService
              .fetchDepartures(selectedStation)
              .then(this.setDepartures.bind(this));
        });
  }

  render() {
    return (
        <div id="board-wrapper">
          <Station onChange={this.handleStationChange}>{this.state.stations}</Station>
          <Departures>{this.state.departures}</Departures>
        </div>
    );
  }
}

export default DepartureBoard;
