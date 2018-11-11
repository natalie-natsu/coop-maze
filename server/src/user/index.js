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

    this.listners = new Map([
      [Events.SET_USER_NAME, this.setName],
      [Events.NEW_GAME, this.newGame],
      [Events.JOIN_GAME, this.joinGame],
      [Events.LEAVE_GAME, this.leaveGame],
      ["disconnect", this.onDisconnect]
    ]);
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

    this.name = name;

    if (this.game) {
      this.game.broadcast();
    }
  }

  newGame() {
    this.leaveGame();
    this.game = new Game(this);
    server.games.set(this.game.id, this.game);
    this.game.broadcast();
    return this.game.id;
  }

  joinGame(gameId) {
    this.leaveGame();

    if (server.games.has(gameId)) {
      this.game = server.games.get(gameId);
      this.game.join(this);
      this.game.broadcast();
    }
  }

  leaveGame() {
    if (!this.game || !this.game.users.has(this.id)) {
      return;
    }

    if (this.game.users.size - 1) {
      this.game.leave(this);
      this.game.broadcast();
    } else {
      const gameId = this.game.id;
      this.game.leave(this);
      server.games.delete(gameId);
    }

    this.game = null;
  }

  onDisconnect() {
    server.users.delete(this.id);

    if (this.game) {
      this.leaveGame();
    }
  }
}
