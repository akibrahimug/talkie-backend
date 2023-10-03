import express, { Router } from 'express';
import { authmiddleware } from '@global/helpers/auth.middleware';
import { Update } from '@notification/controllers/update-notification';
import { Delete } from '@notification/controllers/delete-notification';
import { Get } from '@notification/controllers/get-notifications';

class NotificationRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get(
      '/notifications',
      authmiddleware.checkAuthentication,
      Get.prototype.notifications
    );
    this.router.put(
      '/notification/:notificationId',
      authmiddleware.checkAuthentication,
      Update.prototype.notification
    );
    this.router.delete(
      '/notification/:notificationId',
      authmiddleware.checkAuthentication,
      Delete.prototype.notification
    );

    return this.router;
  }
}

export const notificationRoutes: NotificationRoutes = new NotificationRoutes();
