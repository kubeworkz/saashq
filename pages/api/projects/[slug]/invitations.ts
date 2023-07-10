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
import { addProjectMember, getProject, isProjectAdmin } from 'models/project';
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

// Invite a user to an project
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, role } = req.body;
  const { slug } = req.query as { slug: string };

  const session = await getSession(req, res);

  if (!session) {
    throw new ApiError(401, 'Unauthorized');
  }

  const project = await getProject({ slug });

  if (!(await isProjectAdmin(session.user.id, project.id))) {
    throw new ApiError(400, 'Bad request');
  }

  const invitationExists = await prisma.invitation.findFirst({
    where: {
      email,
      projectId: project.id,
    },
  });

  if (invitationExists) {
    throw new ApiError(400, 'An invitation already exists for this email.');
  }

  const invitation = await createInvitation({
    projectId: project.id,
    invitedBy: session.user.id,
    email,
    role,
  });

  await sendEvent(project.id, 'invitation.created', invitation);

  await sendProjectInviteEmail(project, invitation);

  sendAudit({
    action: 'member.invitation.create',
    crud: 'c',
    user: session.user,
    project,
  });

  res.status(200).json({ data: invitation });
};

// Get all invitations for an organization
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query as { slug: string };

  const session = await getSession(req, res);

  if (!session) {
    throw new ApiError(401, 'Unauthorized');
  }

  const project = await getProject({ slug });

  if (!(await isProjectAdmin(session.user.id, project?.id))) {
    throw new ApiError(400, 'Bad request');
  }

  const invitations = await getInvitations(project.id);

  res.status(200).json({ data: invitations });
};

// Delete an invitation
const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug, id } = req.query as { slug: string; id: string };

  const session = await getSession(req, res);

  if (!session) {
    throw new ApiError(401, 'Unauthorized');
  }

  const project = await getProject({ slug });

  if (!(await isProjectAdmin(session.user.id, project?.id))) {
    throw new ApiError(400, 'Bad request');
  }

  const invitation = await getInvitation({ id });

  if (
    invitation.invitedBy != session.user.id ||
    invitation.projectId != project.id
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
    user: session.user,
    project,
  });

  await sendEvent(project.id, 'invitation.removed', invitation);

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
