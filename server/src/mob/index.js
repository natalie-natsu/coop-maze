import { Events } from '../events';

export const MOBS_TYPE = ['B', 'T', 'R'];
export const MOBS_FOR_ONE_PLAYER = { 'B': 100, 'T': 10, 'R': 10 };

export class Mob {
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

  onMove({ x, y, vx, vy }) {
    if (!this.game || !this.game.started) {
      return;
    }

    this.x = x;
    this.y = y;

    this.vx = vx;
    this.vy = vy;

    this.game.broadcastPosition(this, Events.UPDATE_MOB);
  }
}
