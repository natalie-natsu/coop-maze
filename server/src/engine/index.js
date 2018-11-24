import { env } from "../env";

export class Engine {
  static MAX_PLAYERS = 4;

  static getDistanceBetween(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  static moveIsValid(prevX, prevY, x, y) {
    const distance = Engine.getDistanceBetween(prevX, prevY, x, y);
    return distance <= env.MAX_MOVE_DISTANCE_ALLOWED;
  }

  static areSpeedsValid(vx, vy) {
    return Engine.isSpeedValid(vx) && Engine.isSpeedValid(vy);
  }

  static isSpeedValid(v) {
    return v === 0 || Math.abs(v) === env.PLAYER_SPEED;
  }
}
