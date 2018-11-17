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
    user.init();
  }
}
