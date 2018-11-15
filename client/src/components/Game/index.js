import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { updateGame } from '../../actions/game';
import './Game.css';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isJoining: false };
  }

  componentDidMount() {
    const { game, socket } = this.props;

    if (socket) {
      if (!game.id) {
        this.joinGame();
      } else {
        this.subscribeToGame();
      }
    }
  }

  subscribeToGame() {
    const { dispatch, socket } = this.props;
    socket.on('UPDATE_GAME', (game) => {
      // eslint-disable-next-line no-console
      console.log(game);
      dispatch(updateGame(game));
    });
  }

  joinGame() {
    if (!this.state.isJoining) {
      const { socket, match } = this.props;
      socket.emit('JOIN_GAME', match.params.id, () => {
        this.subscribeToGame();
      });
    }
  }

  render() {
    const { match } = this.props;
    return (
      <div id="game">
        <div className="container">
          Game {match.params.id}
        </div>
      </div>
    );
  }
}

Game.propTypes = {
  dispatch: PropTypes.func.isRequired,
  game: PropTypes.shape({ id: PropTypes.string }).isRequired,
  match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) }).isRequired,
  socket: PropTypes.shape({ emit: PropTypes.func }).isRequired,
  // t: PropTypes.func.isRequired,
};

export default translate()(connect(
  state => ({
    socket: state.socket,
    game: state.game,
  }),
  dispatch => ({ dispatch }),
)(Game));
