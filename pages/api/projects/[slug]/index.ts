import { sendAudit } from '@/lib/retraced';
import { getSession } from '@/lib/session';
import { dropDatabase } from 'knex/knex.config';
import {
  deleteProject,
  getProject,
  isProjectMember,
  isProjectOwner,
  updateProject,
} from 'models/project';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGET(req, res);
    case 'PUT':
      return handlePUT(req, res);
    case 'DELETE':
      return handleDELETE(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({
        data: null,
        error: { message: `Method ${method} Not Allowed` },
      });
  }
}

// Get a project by slug
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query;

  const session = await getSession(req, res);
  const userId = session?.user?.id as string;

  const project = await getProject({ slug: slug as string });

  if (!(await isProjectMember(userId, project.id))) {
    return res.status(400).json({
      data: null,
      error: { message: 'Bad request.' },
    });
  }

  return res.status(200).json({ data: project, error: null });
};

// Update a project
const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query;

  const session = await getSession(req, res);

  if (!session) {
    return res.status(401).json({
      error: { message: 'Unauthorized.' },
    });
  }

  const project = await getProject({ slug: slug as string });

  if (!(await isProjectOwner(session.user.id, project.id))) {
    return res.status(400).json({
      data: null,
      error: { message: `You don't have permission to do this action.` },
    });
  }

  const updatedProject = await updateProject(slug as string, {
    name: req.body.name,
    slug: req.body.slug,
    domain: req.body.domain,
  });

  sendAudit({
    action: 'project.update',
    crud: 'u',
    user: session.user,
    project,
  });

  return res.status(200).json({ data: updatedProject, error: null });
};

// Delete a project
const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const slug = req.query.slug as string;

  const session = await getSession(req, res);

  if (!session) {
    return res.status(401).json({
      error: { message: 'Unauthorized.' },
    });
  }

  const project = await getProject({ slug });

  if (!(await isProjectOwner(session.user.id, project.id))) {
    return res.status(200).json({
      data: null,
      error: { message: `You don't have permission to do this action.` },
    });
  }

  if (await dropDatabase(slug)) {
    await deleteProject({ slug });

    sendAudit({
      action: 'project.delete',
      crud: 'd',
      user: session.user,
      project,
    });
  }

  return res.status(200).json({ data: {}, error: null });
};
