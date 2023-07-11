import express, { Express } from 'express';
import { TalkyServer } from '@root/setupServer';
import databaseConnection from '@root/setupDatabase';
import { config } from '@root/config';

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
}

const application: Application = new Application();
application.initialize();
