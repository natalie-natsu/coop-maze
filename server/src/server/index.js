import express from "express";
import socket from "socket.io";
import { Server as http } from "http";

import { User } from "../user";
import { env } from "../env";

export class Server {
  constructor() {
    const app = express();
    const server = http(app);

    this.io = socket(server);
    this.users = new Map();
    this.games = new Map();

    server.listen(env.WS_PORT);
    console.log(`Server listening on port ${env.WS_PORT}.`);
  }

  init() {
    this.io.on("connection", socket => {
      this.onConnection(socket);
    });
  }

  onConnection(socket) {
    const user = new User(socket);
    this.users.set(socket.id, user);
    this.logTotalUsers();
    user.init();
  }

  logTotalUsers() {
    switch (this.users.size) {
      case 0:
        console.log("Nobody is connected.");
        break;
      case 1:
        console.log("1 user is connected.");
        break;
      default:
        console.log(`${this.users.size} users are connected.`);
        break;
    }
  }

  logTotalGames() {
    switch (this.users.size) {
      case 0:
        console.log("No game in progress.");
        break;
      case 1:
        console.log("1 game in progress.");
        break;
      default:
        console.log(`${this.games.size} games in progress.`);
        break;
    }
  }
}
