import { authmiddleware } from '@global/helpers/auth.middleware';
import { Create } from '@post/controllers/create-post';
import { Delete } from '@post/controllers/delete-post';
import { Get } from '@post/controllers/get-post';
import { Update } from '@post/controllers/update-post';
import express, { Router } from 'express';

class PostRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get(
      '/post/all/:page',
      authmiddleware.checkAuthentication,
      Get.prototype.posts
    );
    this.router.get(
      '/post/images/:page',
      authmiddleware.checkAuthentication,
      Get.prototype.postsWithImages
    );
    this.router.post(
      '/post',
      authmiddleware.checkAuthentication,
      Create.prototype.post
    );
    this.router.post(
      '/post/image/post',
      authmiddleware.checkAuthentication,
      Create.prototype.postWithImage
    );
    this.router.put(
      '/post/:postId',
      authmiddleware.checkAuthentication,
      Update.prototype.posts
    );
    this.router.put(
      '/post/image/:postId',
      authmiddleware.checkAuthentication,
      Update.prototype.postWithImage
    );
    this.router.delete(
      '/post/:postId',
      authmiddleware.checkAuthentication,
      Delete.prototype.post
    );

    return this.router;
  }
}

export const postRoutes: PostRoutes = new PostRoutes();
