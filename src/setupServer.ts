import {
  CustomError,
  IError,
  IErrorResponse,
} from "./Shared/globals/Helpers/error-handler";
import {
  Application,
  json,
  urlencoded,
  Response,
  Request,
  NextFunction,
} from "express";
import http from "http";
import cors from "cors";
// security library
import helmet from "helmet";
import hpp from "hpp";
import cookieSession from "cookie-session";
import HTTP_STATUS from "http-status-codes";
import "express-async-errors";
// compression library helps compress the data from the server (response)
import compression from "compression";
import { config } from "./config";
import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import applicationRoutes from "./routes";
import Logger from "bunyan";

// use this port number for development
//and we will use it in AWS for load balancing and security groups
const SERVER_PORT = process.env.PORT || 5000;
const log: Logger = config.createLogger("server");
export class TalkieServer {
  // express instance
  private app: Application;
  //   use the express instance to create the app
  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHanler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        // to use in AWS for load balancing
        name: "session",
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        // we change secure only for development
        secure: config.NODE_ENV !== "development",
      })
    );
    app.use(helmet());
    app.use(hpp());
    app.use(
      cors({
        origin: config.CLIENT_URL,
        // we set to true for cookies to work
        credentials: true,
        // For older browsers but just to be safe
        optionsSuccessStatus: 200,
        methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
      })
    );
  }

  // manage all the routes
  private routesMiddleware(app: Application): void {
    applicationRoutes(app);
  }
  //   catch all errors
  private globalErrorHanler(app: Application): void {
    // catch all route errors
    app.all("*", (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: `${req.originalUrl} not found`,
      });
    });
    app.use(
      (
        error: IErrorResponse,
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        log.error(error);
        if (error instanceof CustomError) {
          return res.status(error.statusCode).json(error.serializeErrors());
        }
        next();
      }
    );
  }
  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      const socketIO: Server = await this.createSocketIO(httpServer);
      this.startHttpServer(httpServer);
      this.socketIOCOnnections(socketIO);
    } catch (e) {
      log.error(e);
    }
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(
      json({
        limit: "50mb",
      })
    );
    app.use(
      urlencoded({
        extended: true,
        limit: "50mb",
      })
    );
  }
  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
      },
    });
    const pubClient = createClient({ url: config.REDIS_HOST });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    //  use redis adapter
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(SERVER_PORT, () => {
      // Dont use console.log in production
      // use a logger library
      log.info(`Server started on port ${SERVER_PORT}`);
    });
  }

  private socketIOCOnnections(io: Server): void {}
}
