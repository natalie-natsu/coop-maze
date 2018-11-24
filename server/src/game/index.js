import uuidv4 from "uuid/v4";
import { exec } from "child_process";

import { server } from "../";
import { env } from "../env";
import { Events } from "../events";
import { Engine } from "../engine";

export class Game {
  constructor(user, callback) {
    this.id = uuidv4();
    this.users = new Map();
    this.deleteTimeoutId = null;
    this.started = false;

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
        this.spawnPoint = [4, 4]; // TODO search for "*" char

        // Temp fix for spawning point ; TODO remove it
        for (let y = 1; y < 10; y += 1) {
          for (let x = 1; x < 10; x += 1) {
            this.map[y] = this.map[y].split("");
            this.map[y][x] = " ";
            this.map[y] = this.map[y].join("");
          }
        }
      }

      this.join(user);
      callback();
    });
  }

  log(message) {
    console.log(`Game ${this.id} ${message}.`);
  }

  join(user) {
    if (
      this.users.has(user.id) ||
      this.started ||
      this.users.size === Engine.MAX_PLAYERS
    ) {
      return false;
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

    return true;
  }

  leave(user) {
    this.users.delete(user.id);
    user.socket.leave(this.id);
  }

  start() {
    if (this.started) {
      return;
    }

    if (
      this.users.size > 1 &&
      [...this.users.values()].some(user => !user.ready)
    ) {
      return;
    }

    this.started = true;

    setTimeout(() => {
      server.io.to(this.id).emit(Events.START_GAME);
      this.log("starts");
    }, env.START_GAME_TIMEOUT * 1000);

    this.log(`will start in ${env.START_GAME_TIMEOUT} seconds`);
  }

  broadcast() {
    const state = {
      id: this.id,
      users: Array.from(this.users.values()).map(user => ({
        id: user.id,
        name: user.name,
        ready: user.ready,
        x: user.x,
        y: user.y
      }))
    };

    server.io.to(this.id).emit(Events.UPDATE_GAME, state);

    return {
      ...state,
      map: this.map
    };
  }

  broadcastPosition(user) {
    server.io.to(this.id).emit(Events.UPDATE_POSITION, {
      id: user.id,
      x: user.x,
      y: user.y,
      vx: user.vx,
      vy: user.vy
    });
  }

  delete() {
    if (this.deleteTimeoutId) {
      return;
    }

    this.deleteTimeoutId = setTimeout(() => {
      server.games.delete(this.id);
      this.deleteTimeoutId = null;
      this.log("deleted");
      server.logTotalGames();
    }, env.DELETE_GAME_TIMEOUT * 1000);

    this.log(`will be deleted in ${env.DELETE_GAME_TIMEOUT} seconds`);
  }
}
