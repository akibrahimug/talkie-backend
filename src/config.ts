import dotenv from "dotenv";
import bunyan from "bunyan";
dotenv.config({});
class Config {
  public DATABASE_URL: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public CLIENT_URL: string | undefined;
  public REDIS_HOST: string | undefined;

  private readonly DEFAULT_DATABASE_URL =
    "mongodb://127.0.0.1:27017/talkie-backend";

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || this.DEFAULT_DATABASE_URL;
    this.JWT_TOKEN = process.env.JWT_TOKEN || "2521451463";
    this.NODE_ENV = process.env.NODE_ENV || "";
    this.SECRET_KEY_ONE = (process.env.SECRET_KEY_ONE as string) || "";
    this.SECRET_KEY_TWO = (process.env.SECRET_KEY_TWO as string) || "";
    this.CLIENT_URL = process.env.CLIENT_URL || "";
    this.REDIS_HOST = process.env.REDIS_HOST || "";
  }

  // create a logger
  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: "debug" });
  }
  //   make sure the environment variables are set and set correctly
  public validate(): void {
    for (const [key, value] of Object.keys(this)) {
      if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
      }
    }
  }
}

export const config: Config = new Config();
