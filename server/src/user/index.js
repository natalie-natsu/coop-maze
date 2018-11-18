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
    this.ready = false;
    this.x = null;
    this.y = null;

    this.log("connected");

    this.listners = new Map([
      [Events.SET_USER_NAME, this.setName],
      [Events.SET_USER_READY, this.setReady],
      [Events.NEW_GAME, this.newGame],
      [Events.JOIN_GAME, this.joinGame],
      [Events.START_GAME, this.startGame],
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

  setReady(ready) {
    if (!this.game || ready === this.ready) {
      return;
    }

    this.log(ready ? "is ready" : "is not ready");

    this.ready = ready;
    this.game.broadcast();
    this.game.start();
  }

  newGame(callback) {
    this.leaveGame();
    this.game = new Game(this, () => {
      server.games.set(this.game.id, this.game);
      this.initPosition();
      callback && callback(this.game.broadcast());
      this.log(`created game ${this.game.id}`);
      server.logTotalGames();
    });
  }

  joinGame(gameId, callback) {
    this.leaveGame();

    if (!server.games.has(gameId)) {
      return;
    }

    const game = server.games.get(gameId);

    if (game.started) {
      return;
    }

    this.log(`joined game ${game.id}`);

    this.game = game;
    this.game.join(this);
    this.initPosition();
    callback && callback(this.game.broadcast());
  }

  initPosition() {
    // TODO: use spawn point
    this.x = 320;
    this.y = 320;
  }

  startGame() {
    if (!this.game || !this.game.users.has(this.id)) {
      return;
    }

    this.game.start();
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
    if (!this.game || !this.game.started) {
      return;
    }

    // TODO check if user is cheating (moving too fast)
    this.x = x;
    this.y = y;

    this.game.broadcastPosition(this);
  }

  onDisconnect() {
    if (this.game) {
      this.leaveGame();
    }

    this.log("disconnected");

    server.users.delete(this.id);
    server.logTotalUsers();
  }
}
