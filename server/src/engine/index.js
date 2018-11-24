import { env } from "../env";

export class Engine {
  static getDistanceBetween(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  static moveIsValid(prevX, prevY, x, y) {
    const distance = Engine.getDistanceBetween(prevX, prevY, x, y);
    return distance <= env.MAX_MOVE_DISTANCE_ALLOWED;
  }
}
