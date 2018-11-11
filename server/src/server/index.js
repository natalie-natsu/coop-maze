import express from "express";
import socket from "socket.io";
import { Server as http } from "http";

import { User } from "../user";

export class Server {
  constructor() {
    const app = express();
    const server = http(app);

    this.io = socket(server);
    this.users = new Map();
    this.games = new Map();

    // TODO set port in ENV
    server.listen(3001);
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
