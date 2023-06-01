import { Invitation, Project } from '@prisma/client';

import env from '../env';
import { sendEmail } from './sendEmail';

export const sendProjectInviteEmail = async (
  project: Project,
  invitation: Invitation
) => {
  const invitationLink = `${env.appUrl}/invitations/${invitation.token}`;

  await sendEmail({
    to: invitation.email,
    subject: 'Project Invitation',
    html: `You have been invited to join the project, ${project.name}.
    <br/><br/> Click the below link to accept the invitation and join the project team. 
    <br/><br/> <a href="${invitationLink}">${invitationLink}</a>`,
  });
};
