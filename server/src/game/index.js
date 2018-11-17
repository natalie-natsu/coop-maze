import uuidv4 from "uuid/v4";
import { exec } from "child_process";

import { server } from "../";
import { env } from "../env";
import { Events } from "../events";

export class Game {
  static DELETE_TIMEOUT = 10; // seconds

  constructor(user, callback) {
    this.id = uuidv4();
    this.users = new Map();
    this.deleteTimeoutId = null;

    const cmdPath = `${process.cwd()}/maze-generator`;
    const cmdOptions = `${env.MAP_WIDTH} ${env.MAP_HEIGHT}`;
    const cmd = `${env.PYTHON_CMD} ${cmdPath} ${cmdOptions}`;

    const cmdConfig = {
      maxBuffer: env.MAP_WIDTH * env.MAP_HEIGHT + env.MAP_HEIGHT
    };

    exec(cmd, cmdConfig, (err, stdout) => {
      if (err) {
        console.error(err);
      } else {
        this.map = stdout.trim().split("\n");
      }

      this.join(user);
      callback();
    });
  }

  log(message) {
    console.log(`Game ${this.id} ${message}.`);
  }

  join(user) {
    if (this.users.has(user.id)) {
      return;
    }

    if (this.deleteTimeoutId) {
      clearTimeout(this.deleteTimeoutId);
      this.deleteTimeoutId = null;
      this.log("will not be deleted");
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

  delete() {
    if (this.deleteTimeoutId) {
      return;
    }

    this.deleteTimeoutId = setTimeout(() => {
      server.games.delete(this.id);
      this.deleteTimeoutId = null;
      this.log("deleted");
    }, Game.DELETE_TIMEOUT * 1000);

    this.log(`will be deleted in ${Game.DELETE_TIMEOUT} seconds`);
  }
}
