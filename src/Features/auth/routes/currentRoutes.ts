import { CurrentUser } from '@auth/controllers/current-user';
import { authmiddleware } from '@global/helpers/auth.middleware';
import express, { Router } from 'express';

class CurrentUserRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get(
      '/currentuser',
      authmiddleware.checkAuthentication,
      CurrentUser.prototype.read
    );
    return this.router;
  }
}

export const currentUserRoutes: CurrentUserRoutes = new CurrentUserRoutes();
