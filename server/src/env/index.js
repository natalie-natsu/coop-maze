import { cleanEnv, port, str } from "envalid";

export const env = cleanEnv(process.env, {
  WS_PORT: port({ default: 3001 }),
  PYTHON_CMD: str({ default: "python3" }),
});
