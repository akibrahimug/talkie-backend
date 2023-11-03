import express, { Router } from 'express';
import { authmiddleware } from '@global/helpers/auth.middleware';
import { Get } from '@user/controllers/get-profile';
import { Search } from '@user/controllers/search-user';
import { Update } from '@user/controllers/change-password';
import { Edit } from '@user/controllers/update-basic-info';
import { UpdateSettings } from '@user/controllers/update-settings';

class UserRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get(
      '/user/all/:page',
      authmiddleware.checkAuthentication,
      Get.prototype.all
    );
    this.router.get(
      '/user/profile',
      authmiddleware.checkAuthentication,
      Get.prototype.profile
    );
    this.router.get(
      '/user/profile/:userId',
      authmiddleware.checkAuthentication,
      Get.prototype.profileByUserId
    );
    this.router.get(
      '/user/profile/posts/:username/:userId/:uId',
      authmiddleware.checkAuthentication,
      Get.prototype.profileAndPosts
    );
    this.router.get(
      '/user/profile/user/suggestions',
      authmiddleware.checkAuthentication,
      Get.prototype.randomUserSuggestions
    );
    this.router.get(
      '/user/profile/search/:query',
      authmiddleware.checkAuthentication,
      Search.prototype.user
    );

    this.router.put(
      '/user/profile/change-password',
      authmiddleware.checkAuthentication,
      Update.prototype.password
    );
    this.router.put(
      '/user/profile/basic-info',
      authmiddleware.checkAuthentication,
      Edit.prototype.info
    );
    this.router.put(
      '/user/profile/social-links',
      authmiddleware.checkAuthentication,
      Edit.prototype.social
    );
    this.router.put(
      '/user/profile/settings',
      authmiddleware.checkAuthentication,
      UpdateSettings.prototype.notification
    );

    return this.router;
  }
}

export const userRoutes: UserRoutes = new UserRoutes();
