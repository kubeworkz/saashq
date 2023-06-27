import { prisma } from '@/lib/prisma';
import { sendAudit } from '@/lib/retraced';
import { getSession } from '@/lib/session';
import { sendEvent } from '@/lib/svix';
import { Role } from '@prisma/client';
import {
  getProject,
  getProjectMembers,
  isProjectAdmin,
  isProjectMember,
  removeProjectMember,
} from 'models/project';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await handleGET(req, res);
    case 'DELETE':
      return await handleDELETE(req, res);
    case 'PUT':
      return await handlePUT(req, res);
    case 'PATCH':
      return await handlePATCH(req, res);
    default:
      res.setHeader('Allow', 'GET, DELETE, PUT, PATCH');
      res.status(405).json({
        error: { message: `Method ${method} Not Allowed` },
      });
  }
}

// Get members of a project
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query as { slug: string };

  const session = await getSession(req, res);

  if (!session) {
    return res.status(400).json({
      error: { message: 'Bad request.' },
    });
  }

  const userId = session.user.id;
  const project = await getProject({ slug });

  if (!(await isProjectMember(userId, project.id))) {
    return res.status(200).json({
      error: { message: 'Bad request.' },
    });
  }

  const members = await getProjectMembers(slug);

  return res.status(200).json({ data: members });
};

// Delete the member from the project
const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug, memberId } = req.query as { slug: string; memberId: string };

  const session = await getSession(req, res);

  if (!session) {
    return res.status(400).json({
      error: { message: 'Bad request.' },
    });
  }

  const project = await getProject({ slug });

  if (!(await isProjectAdmin(session.user.id, project.id))) {
    return res.status(400).json({
      error: { message: 'You are not allowed to perform this action.' },
    });
  }

  const projectMember = await removeProjectMember(project.id, memberId);

  await sendEvent(project.id, 'member.removed', projectMember);

  sendAudit({
    action: 'member.remove',
    crud: 'd',
    user: session.user,
    project,
  });

  return res.status(200).json({ data: {} });
};

// Leave a project
const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query as { slug: string };

  const session = await getSession(req, res);

  if (!session) {
    return res.status(400).json({
      error: { message: 'Bad request.' },
    });
  }

  const userId = session.user.id;
  const project = await getProject({ slug });

  if (!(await isProjectMember(userId, project.id))) {
    return res.status(400).json({
      error: { message: 'Bad request.' },
    });
  }

  const totalProjectOwners = await prisma.projectMember.count({
    where: {
      role: Role.OWNER,
      projectId: project.id,
    },
  });

  if (totalProjectOwners <= 1) {
    return res.status(400).json({
      error: { message: 'A project should have at least one owner.' },
    });
  }

  await removeProjectMember(project.id, userId);

  return res.status(200).json({ data: {} });
};

// Update the role of a member
const handlePATCH = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query as { slug: string };
  const { memberId, role } = req.body as { memberId: string; role: Role };

  const session = await getSession(req, res);

  if (!session) {
    return res.status(400).json({
      error: { message: 'Bad request.' },
    });
  }

  const userId = session.user.id;
  const project = await getProject({ slug });

  if (!(await isProjectAdmin(userId, project.id))) {
    return res.status(400).json({
      error: { message: 'Bad request.' },
    });
  }

  const memberUpdated = await prisma.projectMember.update({
    where: {
      projectId_userId: {
        projectId: project.id,
        userId: memberId,
      },
    },
    data: {
      role,
    },
  });

  sendAudit({
    action: 'member.update',
    crud: 'u',
    user: session.user,
    project,
  });

  return res.status(200).json({ data: memberUpdated });
};
