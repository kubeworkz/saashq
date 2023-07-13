import { sendProjectInviteEmail } from '@/lib/email/sendProjectInviteEmail';
import { ApiError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import { sendAudit } from '@/lib/retraced';
import { getSession } from '@/lib/session';
import { sendEvent } from '@/lib/svix';
import {
  createInvitation,
  deleteInvitation,
  getInvitation,
  getInvitations,
} from 'models/invitation';
import { addProjectMember, throwIfNoProjectAccess } from 'models/project';
import { throwIfNotAllowed } from 'models/user';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        await handleGET(req, res);
        break;
      case 'POST':
        await handlePOST(req, res);
        break;
      case 'PUT':
        await handlePUT(req, res);
        break;
      case 'DELETE':
        await handleDELETE(req, res);
        break;
      default:
        res.setHeader('Allow', 'GET, POST, PUT, DELETE');
        res.status(405).json({
          error: { message: `Method ${method} Not Allowed` },
        });
    }
  } catch (error: any) {
    const message = error.message || 'Something went wrong';
    const status = error.status || 500;

    res.status(status).json({ error: { message } });
  }
}

// Invite a user to a project
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const projectMember = await throwIfNoProjectAccess(req, res);
  throwIfNotAllowed(projectMember, 'project_invitation', 'create');

  const { email, role } = req.body;

  const invitationExists = await prisma.invitation.findFirst({
    where: {
      email,
      projectId: projectMember.projectId,
    },
  });

  if (invitationExists) {
    throw new ApiError(400, 'An invitation already exists for this email.');
  }

  const invitation = await createInvitation({
    projectId: projectMember.projectId,
    invitedBy: projectMember.userId,
    email,
    role,
  });

  await sendEvent(projectMember.projectId, 'invitation.created', invitation);

  await sendProjectInviteEmail(projectMember.project, invitation);

  sendAudit({
    action: 'member.invitation.create',
    crud: 'c',
    user: projectMember.user,
    project: projectMember.project,
  });

  res.status(200).json({ data: invitation });
};

// Get all invitations for a project
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const projectMember = await throwIfNoProjectAccess(req, res);
  throwIfNotAllowed(projectMember, 'project_invitation', 'read');

  const invitations = await getInvitations(projectMember.projectId);

  res.status(200).json({ data: invitations });
};

// Delete an invitation
const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const projectMember = await throwIfNoProjectAccess(req, res);
  throwIfNotAllowed(projectMember, 'project_invitation', 'delete');

  const { id } = req.query as { id: string };

  const invitation = await getInvitation({ id });

  if (
    invitation.invitedBy != projectMember.user.id ||
    invitation.projectId != projectMember.projectId
  ) {
    throw new ApiError(
      400,
      `You don't have permission to delete this invitation.`
    );
  }

  await deleteInvitation({ id });

  sendAudit({
    action: 'member.invitation.delete',
    crud: 'd',
    user: projectMember.user,
    project: projectMember.project,
  });

  await sendEvent(projectMember.projectId, 'invitation.removed', invitation);

  res.status(200).json({ data: {} });
};

// Accept an invitation to an organization
const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const { inviteToken } = req.body as { inviteToken: string };

  const session = await getSession(req, res);
  const userId = session?.user?.id as string;

  const invitation = await getInvitation({ token: inviteToken });

  const projectMember = await addProjectMember(
    invitation.project.id,
    userId,
    invitation.role
  );

  await sendEvent(invitation.project.id, 'member.created', projectMember);

  await deleteInvitation({ token: inviteToken });

  res.status(200).json({ data: {} });
};
