import { config } from "dotenv";
import { Server } from "./server";

config();

export const server = new Server();

server.init();
