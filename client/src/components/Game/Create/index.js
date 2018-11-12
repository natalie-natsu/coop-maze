import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faGamepad from '@fortawesome/fontawesome-free-solid/faGamepad';

import { setGameId } from '../../../actions/game';
import './GameCreate.css';

class GameCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isCreating: false };
  }

  createGame(event) {
    event.preventDefault();
    if (!this.state.isCreating) {
      const { socket } = this.props;
      socket.emit('NEW_GAME', (gameId) => {
        this.props.dispatch(setGameId(gameId));
      });
    }
  }

  render() {
    const { t } = this.props;
    return (
      <button className="btn btn-light btn-lg" onClick={event => this.createGame(event)}>
        <FontAwesomeIcon icon={faGamepad} /> {t('component:Game.Create.button.start')}
      </button>
    );
  }
}


GameCreate.propTypes = {
  dispatch: PropTypes.func.isRequired,
  socket: PropTypes.shape({ emit: PropTypes.func }).isRequired,
  t: PropTypes.func.isRequired,
};

export default translate([])(connect(
  state => ({ socket: state.socket }),
  dispatch => ({ dispatch }),
)(GameCreate));
