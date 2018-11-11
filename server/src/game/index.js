import uuidv4 from "uuid/v4";

import { server } from '../';
import { Events } from "../events";

export class Game {
  constructor(user) {
    this.id = uuidv4();
    this.users = new Map();
    this.join(user);
  }

  join(user) {
    if (this.users.has(user.id)) {
      return;
    }

    if (user.game) {
      user.game.leave(user);
    }

    this.users.set(user.id, user);
    user.socket.join(this.id);
    user.game = this;
  }

  leave(user) {
    this.users.delete(user.id);
    user.socket.leave(this.id);
    user.game = null;
  }

  broadcast() {
    server.io.to(this.id).emit(Events.UPDATE_GAME, {
      id: this.id,
      users: Array.from(this.users.values()).map(user => user.name)
    });
  }
}
