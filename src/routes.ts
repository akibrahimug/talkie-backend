import { authRoutes } from '@auth/routes/authRoutes';
import { currentUserRoutes } from '@auth/routes/currentRoutes';
import { commentRoutes } from '@comment/routes/comment.routes';
import { followerRoutes } from '@follower/routes/follower.routes';
import { authmiddleware } from '@global/helpers/auth.middleware';
import { postRoutes } from '@post/routes/post.routes';
import { reactionsRoutes } from '@reaction/routes/reactions.routes';
import { serverAdapter } from '@service/queues/base.queue';
import { Application } from 'express';

const BASE_PATH = '/api/v1';
export default (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter());
    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, authRoutes.signoutRoute());

    // only for authenticated users
    app.use(BASE_PATH, authmiddleware.verifyUser, currentUserRoutes.routes());
    app.use(BASE_PATH, authmiddleware.verifyUser, postRoutes.routes());
    app.use(BASE_PATH, authmiddleware.verifyUser, reactionsRoutes.routes());
    app.use(BASE_PATH, authmiddleware.verifyUser, commentRoutes.routes());
    app.use(BASE_PATH, authmiddleware.verifyUser, followerRoutes.routes());
  };
  routes();
};
