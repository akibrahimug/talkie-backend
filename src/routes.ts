import { authRoutes } from '@auth/routes/authRoutes';
import { currentUserRoutes } from '@auth/routes/currentRoutes';
import { chatRoutes } from '@chat/routes/chatRoutes';
import { commentRoutes } from '@comment/routes/comment.routes';
import { followerRoutes } from '@follower/routes/follower.routes';
import { authmiddleware } from '@global/helpers/auth.middleware';
import { imageRoutes } from '@image/routes/imageRoutes';
import { notificationRoutes } from '@notification/routes/notificationRoutes';
import { postRoutes } from '@post/routes/postRoutes';
import { reactionsRoutes } from '@reaction/routes/reactions.routes';
import { serverAdapter } from '@service/queues/base.queue';
import { healthRoutes } from '@user/routes/healthRoutes';
import { userRoutes } from '@user/routes/userRoutes';
import { Application } from 'express';

const BASE_PATH = '/api/v1';
export default (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter());

    // health routes
    app.use('', healthRoutes.health());
    app.use('', healthRoutes.env());
    app.use('', healthRoutes.fiboRoutes());
    app.use('', healthRoutes.instance());

    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, authRoutes.signoutRoute());

    // only for authenticated users
    app.use(BASE_PATH, authmiddleware.verifyUser, currentUserRoutes.routes());
    app.use(BASE_PATH, authmiddleware.verifyUser, postRoutes.routes());
    app.use(BASE_PATH, authmiddleware.verifyUser, reactionsRoutes.routes());
    app.use(BASE_PATH, authmiddleware.verifyUser, commentRoutes.routes());
    app.use(BASE_PATH, authmiddleware.verifyUser, followerRoutes.routes());
    app.use(BASE_PATH, authmiddleware.verifyUser, notificationRoutes.routes());
    app.use(BASE_PATH, authmiddleware.verifyUser, imageRoutes.routes());
    app.use(BASE_PATH, authmiddleware.verifyUser, chatRoutes.routes());
    app.use(BASE_PATH, authmiddleware.verifyUser, userRoutes.routes());
  };
  routes();
};
