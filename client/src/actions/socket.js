export const INIT_SOCKET = 'INIT_SOCKET';
export const SET_SOCKET_ID = 'SET_SOCKET_ID';

export const socketAfterConnect = socket => (dispatch) => {
  dispatch(initSocket(socket));
  dispatch(setSocketId(socket.id));
};

export const initSocket = socket => ({
  type: INIT_SOCKET,
  socket,
});

export const setSocketId = socketId => ({
  type: SET_SOCKET_ID,
  socketId,
});

