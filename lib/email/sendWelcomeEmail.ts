import env from '../env';
import { sendEmail } from './sendEmail';

export const sendWelcomeEmail = async (
  name: string,
  email: string,
  project: string
) => {
  await sendEmail({
    to: email,
    subject: 'Welcome to SaasHQ',
    html: `Hello <b>${name}</b>,
        <br/><br/>You have been successfully signed up to SaasHQ on project <b>${project}</b>. Click the below link to login now.
        <br/><br/><a href="${env.appUrl}/auth/login">Login</a>`,
  });
};
