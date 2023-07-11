import fs from 'fs';
import ejs from 'ejs';
import { IResetPasswordParams } from '@user/interfaces/user.interfaces';

class ResetPasswordTemplate {
  public passwordResetConfirmationTemplate(
    templateParams: IResetPasswordParams
  ): string {
    const { username, email, ipaddress, date } = templateParams;
    return ejs.render(
      fs.readFileSync(__dirname + '/reset-password-template.ejs', 'utf8'),
      {
        username,
        email,
        ipaddress,
        date,
        image_url:
          'https://storage.googleapis.com/my-rest-api-2022-kasoma/lock-unlocked-svgrepo-com.svg',
      }
    );
  }
}

export const resetPasswordTemplate: ResetPasswordTemplate =
  new ResetPasswordTemplate();
