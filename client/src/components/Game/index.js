import React from 'react';
import every from 'lodash/every';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { updateGame, updatePlayers } from '../../actions/game';
import startEngine from '../../engine';

import Layout from './Layout';

import './Game.css';
import Lobby from './Lobby';
import SplashScreen from '../SplashScreen';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.onUpdateGameListener = this.onUpdateGame.bind(this);
    this.onStartGameListener = this.onStartGame.bind(this);

    this.state = {
      isJoining: false,
      engineStarted: false,
      gameStarted: false,
      splash: false,
    };
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

  componentWillUnmount() {
    const { socket } = this.props;
    this.removeListeners();
    socket.emit('LEAVE_GAME');
  }

  onUpdateGame(game) {
    this.props.dispatch(updateGame(game));
    this.props.dispatch(updatePlayers(game.users));

    if (every(game.users, 'ready')) {
      this.setState({ splash: true });
    }
  }

  onStartGame() {
    this.setState({ gameStarted: true, splash: false }, () => {
      this.startEngine();
    });
  }

  removeListeners() {
    const { socket } = this.props;
    socket.removeListener('UPDATE_GAME', this.onUpdateGameListener);
    socket.removeListener('START_GAME', this.onStartGameListener);
  }

  subscribeToGame() {
    const { socket } = this.props;
    socket.on('UPDATE_GAME', this.onUpdateGameListener);
    socket.on('START_GAME', this.onStartGameListener);
  }

  joinGame() {
    if (!this.state.isJoining) {
      this.setState({ isJoining: true }, () => {
        const { dispatch, socket, match } = this.props;
        socket.emit('JOIN_GAME', match.params.id, (game) => {
          dispatch(updateGame(game));
          this.setState({ isJoining: false });
          this.subscribeToGame();
        });
      });
    }
  }

  startEngine(map = this.props.game.map) {
    if (!this.state.engineStarted && map) {
      this.setState({ engineStarted: true }, () => {
        this.removeListeners();
        startEngine(map, this.props.socket);
      });
    }
  }

  render() {
    const { gameStarted, splash } = this.state;
    return (
      <div id="game">
        <Layout>
          <div>
            {splash && <SplashScreen text="component:Game.startInFIve" />}
            {!gameStarted && <Lobby />}
            <div id="phaser-container" />
          </div>
        </Layout>
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
