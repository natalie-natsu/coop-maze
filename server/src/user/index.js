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
    this.name = name;

    if (this.game) {
      this.game.broadcast();
    }
  }

  newGame() {
    const game = new Game(this);
    server.games.set(game.id, game);
    game.broadcast();
  }

  joinGame(gameId) {
    if (server.games.has(gameId)) {
      const game = server.games.get(gameId);
      game.join(this);
      game.broadcast();
    }
  }

  leaveGame(gameId) {
    if (!server.games.has(gameId)) {
      return;
    }

    const game = server.games.get(gameId);

    if (game.sockets.has(this.socket.id)) {
      game.leave(this);
      game.broadcast();
    }
  }

  onDisconnect() {
    server.users.delete(this.id);

    if (!this.game) {
      return;
    }

    const game = this.game;
    game.leave(this);

    if (game.sockets.size) {
      game.broadcast();
    } else {
      server.games.delete(game.id);
    }
  }
}
