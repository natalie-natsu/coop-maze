import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faCircle from '@fortawesome/fontawesome-free-solid/faCircle';

import io from 'socket.io-client';
import { setSocketId } from '../../actions/socket';
import './Socket.css';

const socket = io('http://localhost:3001', {
  autoConnect: false,
});

class Socket extends React.Component {
  componentDidMount() {
    socket.connect();
    socket.on('connect', () => {
      this.props.dispatch(setSocketId(socket.id));
      // eslint-disable-next-line no-console
      console.log(`Connected to socket: ${socket.id}`);
    });
    socket.on('disconnect', () => {
      socket.connect();
      // eslint-disable-next-line no-console
      console.log('Disconnected from socket: trying to reconnect');
    });
  }

  componentWillUnmount() {
    socket.disconnect();
  }

  render() {
    const { socketId } = this.props;
    return socketId && (
      <div id="socketStatus" className="text-muted">
        <FontAwesomeIcon icon={faCircle} /> Connected to socket :<br />{ socketId }
      </div>
    );
  }
}


Socket.propTypes = {
  dispatch: PropTypes.func.isRequired,
  socketId: PropTypes.string,
};

Socket.defaultProps = {
  socketId: null,
};

export default connect(
  state => ({ socketId: state.global.socketId }),
  dispatch => ({ dispatch }),
)(Socket);
