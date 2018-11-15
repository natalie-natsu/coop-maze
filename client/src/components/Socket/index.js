import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faCircle from '@fortawesome/fontawesome-free-solid/faCircle';

import io from 'socket.io-client';
import { socketAfterConnect } from '../../actions/socket';
import './Socket.css';

const socket = io('http://localhost:3001', {
  autoConnect: false,
});

class Socket extends React.Component {
  componentDidMount() {
    socket.connect();
    socket.on('connect', () => {
      this.props.dispatch(socketAfterConnect(socket));
    });
    socket.on('UPDATE_USER', (user) => {
      // eslint-disable-next-line no-console
      console.log(`User is called ${user}`);
    });
  }

  componentWillUnmount() {
    socket.disconnect();
  }

  render() {
    return this.props.socket && (
      <div id="socketStatus" className="text-muted">
        <FontAwesomeIcon icon={faCircle} /> socket { this.props.socket.id }
      </div>
    );
  }
}


Socket.propTypes = {
  dispatch: PropTypes.func.isRequired,
  socket: PropTypes.shape({ id: PropTypes.string }).isRequired,
};

export default connect(
  state => ({ socket: state.socket }),
  dispatch => ({ dispatch }),
)(Socket);
