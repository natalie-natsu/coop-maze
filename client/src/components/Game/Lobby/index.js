import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { updatePlayers } from '../../../actions/game';

import './Lobby.css';

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isSettingReady: false };
  }

  setReady() {
    if (!this.state.isSettingReady) {
      this.setState({ isSettingReady: true });
      const { dispatch, socket } = this.props;
      socket.emit('SET_USER_READY', (users) => {
        dispatch(updatePlayers(users));
        this.setState({ isSettingReady: false });
      });
    }
  }

  renderUser({ id, name, ready }) {
    return (
      <li key={`player-${id}`}>
        <span>{id} - {name}</span>
        <span className="form-group form-check d-inline ml-3">
          <input
            type="checkbox"
            className="form-check-input"
            id={`ready-${id}`}
            value={ready}
            onClick={(e) => {
              e.preventDefault();
              this.setReady();
            }}
          />
          <label className="form-check-label" htmlFor={`ready-${id}`}>Ready</label>
        </span>
      </li>
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
  dispatch: PropTypes.func.isRequired,
  game: PropTypes.shape({ id: PropTypes.string, users: PropTypes.arrayOf(PropTypes.object) }).isRequired,
  socket: PropTypes.shape({ emit: PropTypes.func }).isRequired,
};

export default translate()(connect(
  state => ({
    socket: state.socket,
    game: state.game,
  }),
  dispatch => ({ dispatch }),
)(Lobby));
