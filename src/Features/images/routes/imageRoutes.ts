import express, { Router } from 'express';
import { authmiddleware } from '@global/helpers/auth.middleware';
import { Add } from '@image/controllers/add-image';
import { Delete } from '@image/controllers/delete-image';
import { Get } from '@image/controllers/get-images';

class ImageRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get(
      '/images/:userId',
      authmiddleware.checkAuthentication,
      Get.prototype.images
    );
    this.router.post(
      '/images/profile',
      authmiddleware.checkAuthentication,
      Add.prototype.profileImage
    );
    this.router.post(
      '/images/background',
      authmiddleware.checkAuthentication,
      Add.prototype.backgroundImage
    );
    this.router.delete(
      '/images/:imageId',
      authmiddleware.checkAuthentication,
      Delete.prototype.image
    );
    this.router.delete(
      '/images/background/:bgImageId',
      authmiddleware.checkAuthentication,
      Delete.prototype.backgroundImage
    );

    return this.router;
  }
}

export const imageRoutes: ImageRoutes = new ImageRoutes();
