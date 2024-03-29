import mongoose from 'mongoose';
import { config } from '@root/config';
import Logger from 'bunyan';
import { redisConnection } from '@service/redis/redis.connection';

const log: Logger = config.createLogger('SetUpDatabase');
export default () => {
  const connect = () => {
    mongoose.set('strictQuery', false);
    mongoose
      .connect(config.DATABASE_URL!)
      .then(() => {
        log.info('Successfully connected to MongoDB');
        redisConnection.connect();
      })
      .catch((e) => {
        log.error('Connection error', e.message);
        // this will exit the process with an error code and get logs
        return process.exit(1);
      });
  };
  connect();
  //   if it disconnects, it will try to reconnect again automatically
  mongoose.connection.on('disconnected', connect);
};
