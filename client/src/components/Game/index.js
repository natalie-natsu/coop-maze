import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { updateGame } from '../../actions/game';
import render from './render';
import './Game.css';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isJoining: false, mapRendered: false };
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

    this.renderMap();
  }

  componentWillUnmount() {
    // TODO: emit LEAVE_GAME
  }

  subscribeToGame() {
    const { dispatch, socket } = this.props;
    socket.on('UPDATE_GAME', (game) => {
      // eslint-disable-next-line no-console
      console.log('on UPDATE_GAME:', game);
      dispatch(updateGame(game));
    });
  }

  joinGame() {
    if (!this.state.isJoining) {
      this.setState({ isJoining: true });
      const { dispatch, socket, match } = this.props;
      socket.emit('JOIN_GAME', match.params.id, (game) => {
        dispatch(updateGame(game));
        this.renderMap(game.map);
        this.setState({ isJoining: false });
        this.subscribeToGame();
      });
    }
  }

  renderMap(map = this.props.game.map) {
    if (!this.state.mapRendered && map) {
      this.setState({ mapRendered: true });
      render(map);
    }
  }

  render() {
    const { game } = this.props;
    return (
      <div id="game">
        <div className="container">
          <div id="phaser-container" />
          Game {game.id}
        </div>
      </div>
    );
  }
}

Game.propTypes = {
  dispatch: PropTypes.func.isRequired,
  game: PropTypes.shape({ id: PropTypes.string, map: PropTypes.arrayOf(PropTypes.string) }).isRequired,
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
