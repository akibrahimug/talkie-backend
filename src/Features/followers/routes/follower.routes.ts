import express, { Router } from 'express';
import { authmiddleware } from '@global/helpers/auth.middleware';
import { Add } from '@follower/controllers/follower-user';
import { Remove } from '@follower/controllers/unfollow-user';
import { Get } from '@follower/controllers/get-followers';
import { AddUser } from '@follower/controllers/block-user';

class FollowerRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get(
      '/user/following',
      authmiddleware.checkAuthentication,
      Get.prototype.userFollowing
    );

    this.router.get(
      '/user/followers/:userId',
      authmiddleware.checkAuthentication,
      Get.prototype.userFollowers
    );

    this.router.put(
      '/user/follow/:followerId',
      authmiddleware.checkAuthentication,
      Add.prototype.follower
    );

    this.router.put(
      '/user/unfollow/:followeeId/:followerId',
      authmiddleware.checkAuthentication,
      Remove.prototype.follower
    );

    this.router.put(
      '/user/block/:followerId',
      authmiddleware.checkAuthentication,
      AddUser.prototype.block
    );

    this.router.put(
      '/user/unblock/:followerId',
      authmiddleware.checkAuthentication,
      AddUser.prototype.unblock
    );

    return this.router;
  }
}

export const followerRoutes: FollowerRoutes = new FollowerRoutes();
