import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import './Lobby.css';

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isReady: false };
  }

  setReady() {
    const isReady = !this.state.isReady;

    this.setState({ isReady }, () => {
      this.props.socket.emit('SET_USER_READY', isReady);
    });
  }

  renderUser({ id, name, ready }) {
    return (
      <li key={`player-${id}`}>
        <span>{id} - {name}</span>
        <span className="form-group form-check d-inline ml-3">
          {this.renderCheckbox(id, ready)}
          <label className="form-check-label" htmlFor={`ready-${id}`}>Ready</label>
        </span>
      </li>
    );
  }

  renderCheckbox(id, ready) {
    if (id === this.props.socket.id) {
      return (
        <input
          type="checkbox"
          className="form-check-input"
          id={`ready-${id}`}
          checked={ready}
          onChange={(e) => {
            e.preventDefault();
            this.setReady();
          }}
        />
      );
    }

    return (
      <input
        type="checkbox"
        className="form-check-input"
        id={`ready-${id}`}
        checked={ready}
        readOnly
      />
    );
  }

  render() {
    const { users } = this.props.game;
    return (
      <div id="game-players-waiting">
        {users && (<ul>{users.map(user => this.renderUser(user))}</ul>)}
      </div>
    );
  }
}

Lobby.propTypes = {
  game: PropTypes.shape({ id: PropTypes.string, users: PropTypes.arrayOf(PropTypes.object) }).isRequired,
  socket: PropTypes.shape({
    id: PropTypes.string,
    emit: PropTypes.func,
  }).isRequired,
};

export default translate()(connect(
  state => ({
    socket: state.socket,
    game: state.game,
  }),
  dispatch => ({ dispatch }),
)(Lobby));
