import { Request, Response } from 'express';
import { config } from '@root/config';
import { joiValidation } from '@global/decorators/joi-validation.decorator';
import { BadRequestError } from '@global/helpers/error-handler';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { emailSchema, passwordSchema } from '@auth/schemes/password';
import { authService } from '@service/db/auth.service';
import crypto from 'crypto';
import { forgotPasswordTemplate } from '@service/emails/templates/forgotPassword/forgot-password-template';
import { emailQueue } from '@service/queues/email.queue';
import { IResetPasswordParams } from '@user/interfaces/user.interface';
import publicIP from 'ip';
import moment from 'moment';
import { resetPasswordTemplate } from '@service/emails/templates/resetPassword/reset-password-template';
import HTTP_STATUS from 'http-status-codes';
export class Password {
  @joiValidation(emailSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    const existingUser: IAuthDocument = await authService.getAuthUserByEmail(
      email
    );
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }
    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters: string = randomBytes.toString('hex');

    await authService.updatePasswordToken(
      `${existingUser._id!}`,
      randomCharacters,
      Date.now() * 60 * 60 * 1000
    );

    const resetLink = `${config.CLIENT_URL}/reset-password?token=${randomCharacters}`;
    const template: string = forgotPasswordTemplate.forgotPassword(
      existingUser.username!,
      resetLink
    );
    emailQueue.addEmailJob('forgotPasswordEmail', {
      template,
      receiverEmail: email,
      subject: 'Reset your password',
    });
    res.status(HTTP_STATUS.OK).json({ message: 'Password Reset Email Sent.' });
  }

  @joiValidation(passwordSchema)
  public async update(req: Request, res: Response): Promise<void> {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;
    if (password !== confirmPassword) {
      throw new BadRequestError('Passwords do not match');
    }
    const existingUser: IAuthDocument =
      await authService.getAuthUserByPasswordToken(token);
    if (!existingUser) {
      throw new BadRequestError('Reset token has expired');
    }

    existingUser.password = password;
    existingUser.passwordResetExpires = undefined;
    existingUser.passwordResetToken = undefined;
    await existingUser.save();

    const templateParams: IResetPasswordParams = {
      username: existingUser.username!,
      email: existingUser.email!,
      ipaddress: publicIP.address(),
      date: moment().format('DD/MM/YYYY HH:mm'),
    };

    const template: string =
      resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams);
    emailQueue.addEmailJob('forgotPasswordEmail', {
      template,
      receiverEmail: existingUser.email!,
      subject: 'Password Reset Confirmation',
    });

    res.status(HTTP_STATUS.OK).json({ message: 'Password Reset Successful.' });
  }
}
