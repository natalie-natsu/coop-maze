import { env } from "../env";
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

  initPosition() {
    const [x, y] = this.spawnPoint;

    switch (this.game.mobs[this.type].size) {
      case 1:
        this.x = x * env.TILE_SIZE;
        this.y = (y - 1) * env.TILE_SIZE;
        break;
      case 2:
        this.x = (x + 1) * env.TILE_SIZE;
        this.y = y * env.TILE_SIZE;
        break;
      case 3:
        this.x = x * env.TILE_SIZE;
        this.y = (y + 1) * env.TILE_SIZE;
        break;
      case 4:
        this.x = (x - 1) * env.TILE_SIZE;
        this.y = y * env.TILE_SIZE;
        break;
      default:
        this.x = x * env.TILE_SIZE;
        this.y = y * env.TILE_SIZE;
        break;
    }

    this.x += env.TILE_SIZE / 2;
    this.y += env.TILE_SIZE / 2;
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
