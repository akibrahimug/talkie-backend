import { authmiddleware } from '@global/helpers/auth.middleware';
import express, { Router } from 'express';
import { Add } from '@reaction/controllers/add-reaction';
import { Remove } from '@reaction/controllers/remove-reaction';
class ReactionsRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post(
      '/post/reaction',
      authmiddleware.checkAuthentication,
      Add.prototype.reaction
    );

    this.router.delete(
      '/post/reaction/:postId/:previousReaction/:postReactions',
      authmiddleware.checkAuthentication,
      Remove.prototype.reaction
    );
    return this.router;
  }
}

export const reactionsRoutes: ReactionsRoutes = new ReactionsRoutes();
