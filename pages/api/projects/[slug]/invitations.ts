import { sendProjectInviteEmail } from '@/lib/email/sendProjectInviteEmail';
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

  switch (method) {
    case 'GET':
      return await handleGET(req, res);
    case 'POST':
      return await handlePOST(req, res);
    case 'PUT':
      return await handlePUT(req, res);
    case 'DELETE':
      return await handleDELETE(req, res);
    default:
      res.setHeader('Allow', 'GET, POST, PUT, DELETE');
      res.status(405).json({
        error: { message: `Method ${method} Not Allowed` },
      });
  }
}

// Invite a user to a project
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, role } = req.body;
  const { slug } = req.query as { slug: string };

  const session = await getSession(req, res);

  if (!session) {
    return res.status(401).json({
      error: { message: 'Unauthorized.' },
    });
  }

  const project = await getProject({ slug });

  if (!(await isProjectAdmin(session.user.id, project.id))) {
    return res.status(400).json({
      error: { message: 'Bad request.' },
    });
  }

  const invitationExists = await prisma.invitation.findFirst({
    where: {
      email,
      projectId: project.id,
    },
  });

  if (invitationExists) {
    return res.status(400).json({
      error: { message: 'An invitation already exists for this email.' },
    });
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

  return res.status(200).json({ data: invitation });
};

// Get all invitations for an organization
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query as { slug: string };

  const session = await getSession(req, res);

  if (!session) {
    return res.status(401).json({
      error: { message: 'Unauthorized.' },
    });
  }

  const project = await getProject({ slug });

  if (!(await isProjectAdmin(session.user.id, project?.id))) {
    return res.status(400).json({
      error: { message: 'Bad request.' },
    });
  }

  const invitations = await getInvitations(project.id);

  return res.status(200).json({ data: invitations });
};

// Delete an invitation
const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.body;
  const { slug } = req.query as { slug: string };

  const session = await getSession(req, res);

  if (!session) {
    return res.status(401).json({
      error: { message: 'Unauthorized.' },
    });
  }

  const project = await getProject({ slug });

  if (!(await isProjectAdmin(session.user.id, project?.id))) {
    return res.status(400).json({
      error: { message: 'Bad request.' },
    });
  }

  const invitation = await getInvitation({ id });

  if (invitation.invitedBy != session.user.id || invitation.projectId != project.id) {
    return res.status(400).json({
      error: {
        message: "You don't have permission to delete this invitation.",
      },
    });
  }

  await deleteInvitation({ id });

  sendAudit({
    action: 'member.invitation.delete',
    crud: 'd',
    user: session.user,
    project,
  });

  await sendEvent(project.id, 'invitation.removed', invitation);

  return res.status(200).json({ data: {} });
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

  return res.status(200).json({ data: {} });
};
