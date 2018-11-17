import { cleanEnv, num, port, str } from "envalid";

export const env = cleanEnv(process.env, {
  WS_PORT: port({ default: 3001 }),
  PYTHON_CMD: str({ default: "python3" }),
  MAP_WIDTH: num({ default: 100 }),
  MAP_HEIGHT: num({ default: 75 })
});
