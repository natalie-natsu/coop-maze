import { Events } from "../events";

export class Mob {
  // Mob B is the beacon (alerting others)
  // Mob K is the one killing
  // Mob R is the one reproducing
  static TYPES = ["B", "K", "R"];
  static NUMBER_FOR_ONE_PLAYER = { B: 10, K: 100, R: 10 };

  constructor(id, game, type, spawnPoint) {
    this.id = id;
    this.game = game;
    this.type = type;
    this.alerted = false;
    this.life = [3, 3];
    this.x = spawnPoint[0];
    this.y = spawnPoint[1];
    this.vx = 0;
    this.vy = 0;
  }

  move() {
    this.game.broadcastPosition(this, Events.UPDATE_MOB_POSITION);
  }
}
