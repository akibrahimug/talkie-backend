import { Request, Response } from 'express';
import { config } from '@root/config';
import { joiValidation } from '@global/decorators/joi-validation.decorator';
import HTTP_STATUS from 'http-status-codes';
import JWT from 'jsonwebtoken';
import { BadRequestError } from '@global/helpers/error-handler';
import { authService } from '@service/db/auth.service';
import { loginSchema } from '@auth/schemes/signin';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { IUserDocument } from '@user/interfaces/user.interfaces';
import { userService } from '@service/db/user.service';
export class SignIn {
  @joiValidation(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const existingUser: IAuthDocument = await authService.getAuthUserByUsername(
      username
    );
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch: boolean = await existingUser.comparePassword(
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError('Invlalid credentials');
    }

    const user: IUserDocument = await userService.getUserByAuthId(
      `${existingUser._id}`
    );

    const userJWT: string = JWT.sign(
      {
        userId: user._id,
        uId: existingUser.uId,
        email: existingUser.email,
        username: existingUser.username,
        avatarColor: existingUser.avatarColor,
      },
      config.JWT_TOKEN!
    );
    req.session = { jwt: userJWT };
    const userDocument: IUserDocument = {
      ...user,
      authId: existingUser!._id,
      avatarColor: existingUser!.avatarColor,
      email: existingUser!.email,
      uId: existingUser!.uId,
      createdAt: existingUser!.createdAt,
    } as IUserDocument;
    res.status(HTTP_STATUS.OK).json({
      message: 'User login successful',
      user: userDocument,
      token: userJWT,
    });
  }
}
