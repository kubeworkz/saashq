import { sendAudit } from '@/lib/retraced';
import {
  deleteProject,
  getProject,
  throwIfNoProjectAccess,
  updateProject,
} from 'models/project';
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
  const projectMember = await throwIfNoProjectAccess(req, res);
  throwIfNotAllowed(projectMember, 'project', 'read');

  const project = await getProject({ id: projectMember.projectId });

  res.status(200).json({ data: project });
};

// Update a project
const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const projectMember = await throwIfNoProjectAccess(req, res);
  throwIfNotAllowed(projectMember, 'project', 'update');

  const updatedProject = await updateProject(projectMember.project.slug, {
    name: req.body.name,
    slug: req.body.slug,
    domain: req.body.domain,
  });

  sendAudit({
    action: 'project.update',
    crud: 'u',
    user: projectMember.user,
    project: projectMember.project,
  });

  res.status(200).json({ data: updatedProject });
};

// Delete a project
const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const projectMember = await throwIfNoProjectAccess(req, res);
  throwIfNotAllowed(projectMember, 'project', 'delete');

  await deleteProject({ id: projectMember.projectId });

  sendAudit({
    action: 'project.delete',
    crud: 'd',
    user: projectMember.user,
    project: projectMember.project,
  });

  res.status(200).json({ data: {} });
};
