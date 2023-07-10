import { ApiError } from '@/lib/errors';
import { sendAudit } from '@/lib/retraced';
import { getSession } from '@/lib/session';
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

  try {
    switch (method) {
      case 'GET':
        await handleGET(req, res);
        break;
      case 'PUT':
        await handlePUT(req, res);
        break;
      case 'DELETE':
        await handleDELETE(req, res);
        break;
      default:
        res.setHeader('Allow', 'GET, PUT, DELETE');
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

// Get a project by slug
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query;

  const session = await getSession(req, res);
  const userId = session?.user?.id as string;

  const project = await getProject({ slug: slug as string });

  if (!(await isProjectMember(userId, project.id))) {
    throw new ApiError(400, 'Bad request');
  }

  res.status(200).json({ data: project });
};

// Update a project
const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query;

  const session = await getSession(req, res);

  if (!session) {
    throw new ApiError(401, 'Unauthorized');
  }

  const project = await getProject({ slug: slug as string });

  if (!(await isProjectOwner(session.user.id, project.id))) {
    throw new ApiError(400, `You don't have permission to do this action.`);
  }

  const updatedProject = await updateProject(slug as string, {
    name: req.body.name,
    slug: req.body.slug,
    domain: req.body.domain,
  });

  sendAudit({
    action: 'project.update',
    crud: 'u',
    user: session?.user,
    project,
  });

  res.status(200).json({ data: updatedProject });
};

// Delete a project
const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const slug = req.query.slug as string;

  const session = await getSession(req, res);

  if (!session) {
    throw new ApiError(401, 'Unauthorized');
  }

  const project = await getProject({ slug });

  if (!(await isProjectOwner(session.user.id, project.id))) {
    throw new ApiError(400, `You don't have permission to do this action.`);
  }

  await deleteProject({ slug });

  sendAudit({
    action: 'project.delete',
    crud: 'd',
    user: session.user,
    project,
  });

  res.status(200).json({ data: {} });
};
