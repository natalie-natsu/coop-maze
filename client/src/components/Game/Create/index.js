import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faGamepad from '@fortawesome/fontawesome-free-solid/faGamepad';

import { setGameId, updateGame } from '../../../actions/game';
import './GameCreate.css';
import { routes } from '../../../helpers/routes';

class GameCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isCreating: false };
  }

  createGame(event) {
    event.preventDefault();
    if (!this.state.isCreating) {
      const { socket } = this.props;
      socket.emit('NEW_GAME', (game) => {
        this.props.dispatch(setGameId(game.id));
        this.props.dispatch(updateGame(game));
        this.props.history.push(routes.game.replace(':id', game.id));
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
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  socket: PropTypes.shape({ emit: PropTypes.func }).isRequired,
  t: PropTypes.func.isRequired,
};

export default withRouter(translate([])(connect(
  state => ({ socket: state.socket }),
  dispatch => ({ dispatch }),
)(GameCreate)));
