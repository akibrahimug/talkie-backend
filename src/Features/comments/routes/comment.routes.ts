import express, { Router } from 'express';
import { authmiddleware } from '@global/helpers/auth.middleware';
import { Get } from '@comment/controllers/get-comments';
import { Add } from '@comment/controllers/add-comment';

class CommentRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get(
      '/post/comments/:postId',
      authmiddleware.checkAuthentication,
      Get.prototype.comments
    );
    this.router.get(
      '/post/commentsnames/:postId',
      authmiddleware.checkAuthentication,
      Get.prototype.commentsNamesFromCache
    );
    this.router.get(
      '/post/single/comment/:postId/:commentId',
      authmiddleware.checkAuthentication,
      Get.prototype.singleComment
    );

    this.router.post(
      '/post/comment',
      authmiddleware.checkAuthentication,
      Add.prototype.comment
    );

    return this.router;
  }
}

export const commentRoutes: CommentRoutes = new CommentRoutes();
