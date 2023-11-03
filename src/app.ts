import express, { Express } from 'express';
import { TalkyServer } from '@root/setupServer';
import databaseConnection from '@root/setupDatabase';
import { config } from '@root/config';
import Logger from 'bunyan';

const log: Logger = config.createLogger('app');
class Application {
  public initialize(): void {
    this.loadConfig();
    //  connect to the database before starting the server
    databaseConnection();
    const app: Express = express();
    const server: TalkyServer = new TalkyServer(app);
    server.start();
  }

  private loadConfig(): void {
    //  load the configuration
    config.validate();
    config.cloudinaryConfig();
  }

  // handle all process errors
  private static handleExit(): void {
    process.on('uncaughtException', (error: Error) => {
      log.error(`There was an uncaught error: ${error}`);
      Application.shutDownProperly(1);
    });

    process.on('unhandleRejection', (reason: Error) => {
      log.error(`Unhandled rejsection at promise: ${reason}`);
      Application.shutDownProperly(2);
    });

    process.on('SIGTERM', () => {
      log.error('Caught a ***SIGTERM***(signal to terminate a process)');
      Application.shutDownProperly(2);
    });
  }

  private static shutDownProperly(exitCode: number): void {
    Promise.resolve()
      .then(() => {
        log.info('Shutdown complete');
        process.exit(exitCode);
      })
      .catch((error) => {
        log.error(`Error during shutdown: ${error}`);
        process.exit(1);
      });
  }
}

const application: Application = new Application();
application.initialize();
