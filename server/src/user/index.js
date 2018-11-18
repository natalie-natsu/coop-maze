import faker from "faker";

import { Events } from "../events";
import { Game } from "../game";
import { server } from "../";

export class User {
  constructor(socket) {
    this.socket = socket;
    this.id = socket.id;
    this.game = null;
    this.name = faker.name.firstName();
    this.x = null;
    this.y = null;

    this.log("connected");

    this.listners = new Map([
      [Events.SET_USER_NAME, this.setName],
      [Events.NEW_GAME, this.newGame],
      [Events.JOIN_GAME, this.joinGame],
      [Events.LEAVE_GAME, this.leaveGame],
      [Events.MOVE, this.onMove],
      ["disconnect", this.onDisconnect]
    ]);
  }

  log(message) {
    console.log(`User ${this.id} (${this.name}) ${message}.`);
  }

  init() {
    this.socket.emit(Events.UPDATE_USER, this.name);

    this.listners.forEach((listener, event) => {
      this.socket.on(event, listener.bind(this));
    });
  }

  setName(name) {
    if (name === this.name) {
      return;
    }

    this.log(`renamed to ${name}`);

    this.name = name;

    if (this.game) {
      this.game.broadcast();
    }
  }

  newGame(callback) {
    this.leaveGame();
    this.game = new Game(this, () => {
      server.games.set(this.game.id, this.game);
      this.initPosition();
      callback(this.game.broadcast());
      this.log(`created game ${this.game.id}`);
    });
  }

  joinGame(gameId, callback) {
    this.leaveGame();

    if (server.games.has(gameId)) {
      this.game = server.games.get(gameId);
      this.game.join(this);
      this.initPosition();
      callback(this.game.broadcast());
      this.log(`joined game ${this.game.id}`);
    }
  }

  initPosition() {
    // TODO: use spawn point
    this.x = 320;
    this.y = 320;
  }

  leaveGame() {
    if (!this.game || !this.game.users.has(this.id)) {
      return;
    }

    this.log(`leaved game ${this.game.id}`);

    if (this.game.users.size - 1) {
      this.game.leave(this);
      this.game.broadcast();
    } else {
      this.game.delete();
      this.game.leave(this);
    }

    this.game = null;
  }

  onMove(x, y) {
    if (this.game) {
      // TODO check if user is cheating (moving too fast)
      this.x = x;
      this.y = y;

      this.game.broadcastPosition(this);
    }
  }

  onDisconnect() {
    server.users.delete(this.id);

    if (this.game) {
      this.leaveGame();
    }

    this.log("disconnected");
  }
}
