import React from 'react';
import logo from './logo.svg';
import './DepartureBoard.css';

function Station(props) {
  return <select>
      <option key="" value="">Select a station...</option>
      {
          Object.entries(props.children)
              .sort(([,nameA], [,nameB]) => nameA.localeCompare(nameB))
              .map(([key, name]) => <option key={key} value={key}>{name}</option>)
      }
  </select>;
}

class DepartureBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stations: {},
    };

    props.transportationService
        .fetchStations()
        .then(this.setStations.bind(this));
  }

  setStations(stations) {
    this.setState({stations});
  }

  render() {
    return (
        <div id="board-wrapper">
          <Station>{this.state.stations}</Station>
        </div>
    );
  }
}

export default DepartureBoard;
