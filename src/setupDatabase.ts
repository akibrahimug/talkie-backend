<<<<<<< HEAD
import mongoose from 'mongoose';
import { config } from './config';
import Logger from 'bunyan';

const logger: Logger = config.createLogger('setupDatabase');
=======
import mongoose from "mongoose";
import { config } from "./config";
import Logger from "bunyan";

const log: Logger = config.createLogger("database");
>>>>>>> 38620003d91b652f55dba3bfff93bebd13179c58
export default () => {
  const connect = () => {
    mongoose.set('strictQuery', false);
    mongoose
      .connect(config.DATABASE_URL!)
      .then(() => {
<<<<<<< HEAD
        logger.info('Successfully connected to MongoDB');
      })
      .catch((e) => {
        logger.error('Connection error', e.message);
=======
        log.info("Successfully connected to MongoDB");
      })
      .catch((e) => {
        log.error("Connection error", e.message);
>>>>>>> 38620003d91b652f55dba3bfff93bebd13179c58
        // this will exit the process with an error code and get logs
        return process.exit(1);
      });
  };
  connect();
  //   if it disconnects, it will try to reconnect again automatically
  mongoose.connection.on('disconnected', connect);
};
