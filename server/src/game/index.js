import uuidv4 from "uuid/v4";
import { exec } from "child_process";

import { server } from '../';
import { env } from '../env';
import { Events } from "../events";

export class Game {
  constructor(user, callback) {
    this.id = uuidv4();
    this.users = new Map();

    exec(`${env.PYTHON_CMD} ${process.cwd()}/../maze-generator`, (err, stdout) => {
      if (err) {
        console.error(err);
      } else {
        this.map = stdout.trim().split('\n');
      }

      this.join(user);
      callback();
    });
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
  }

  leave(user) {
    this.users.delete(user.id);
    user.socket.leave(this.id);
  }

  broadcast() {
    const state = {
      id: this.id,
      users: Array.from(this.users.values()).map(user => user.name),
      map: this.map
    };

    server.io.to(this.id).emit(Events.UPDATE_GAME, state);
    return state;
  }
}
