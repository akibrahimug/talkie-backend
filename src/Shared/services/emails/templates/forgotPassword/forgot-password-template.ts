import fs from 'fs';
import ejs from 'ejs';

class ForgotPasswordTemplate {
  public forgotPassword(username: string, resetLink: string): string {
    return ejs.render(
      fs.readFileSync(__dirname + '/forgot-password-template.ejs', 'utf8'),
      {
        username,
        resetLink,
        image_url:
          'https://storage.googleapis.com/my-rest-api-2022-kasoma/lock-unlocked-svgrepo-com.svg',
      }
    );
  }
}

export const forgotPasswordTemplate: ForgotPasswordTemplate =
  new ForgotPasswordTemplate();
