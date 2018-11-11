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
      // eslint-disable-next-line no-console
      console.log(`Connected to socket: ${socket.id}`);
    });
  }

  componentWillUnmount() {
    socket.disconnect();
  }

  render() {
    const { ws } = this.props;
    return ws && (
      <div id="socketStatus" className="text-muted">
        <FontAwesomeIcon icon={faCircle} /> Connected to socket :<br />{ ws.id }
      </div>
    );
  }
}


Socket.propTypes = {
  dispatch: PropTypes.func.isRequired,
  ws: PropTypes.shape({ id: PropTypes.string }).isRequired,
};

export default connect(
  state => ({ ws: state.socket }),
  dispatch => ({ dispatch }),
)(Socket);
