import { sendAudit } from '@/lib/retraced';
import { getSession } from '@/lib/session';
import { findOrCreateApp, findWebhook, updateWebhook } from '@/lib/svix';
import { getProject, isProjectMember } from 'models/project';
import type { NextApiRequest, NextApiResponse } from 'next';
import { EndpointIn } from 'svix';

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
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).json({
        data: null,
        error: { message: `Method ${method} Not Allowed` },
      });
  }
}

// Get a Webhook
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug, endpointId } = req.query;

  const session = await getSession(req, res);
  const userId = session?.user?.id as string;

  const project = await getProject({ slug: slug as string });

  if (!(await isProjectMember(userId, project?.id))) {
    return res.status(200).json({
      data: null,
      error: { message: 'Bad request.' },
    });
  }

  const app = await findOrCreateApp(project.name, project.id);

  if (!app) {
    return res.status(200).json({
      data: null,
      error: { message: 'Bad request.' },
    });
  }

  const webhook = await findWebhook(app.id, endpointId as string);

  return res.status(200).json({ data: webhook, error: null });
};

// Update a Webhook
const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug, endpointId } = req.query;
  const { name, url, eventTypes } = req.body;

  const session = await getSession(req, res);

  if (!session) {
    return res.status(401).json({
      error: { message: 'Unauthorized.' },
    });
  }

  const project = await getProject({ slug: slug as string });

  if (!(await isProjectMember(session.user.id, project?.id))) {
    return res.status(200).json({
      data: null,
      error: { message: 'Bad request.' },
    });
  }

  const app = await findOrCreateApp(project.name, project.id);

  const data: EndpointIn = {
    description: name,
    url,
    version: 1,
  };

  if (eventTypes.length > 0) {
    data['filterTypes'] = eventTypes;
  }

  if (!app) {
    return res.status(200).json({
      data: null,
      error: { message: 'Bad request.' },
    });
  }

  const webhook = await updateWebhook(app.id, endpointId as string, data);

  sendAudit({
    action: 'webhook.update',
    crud: 'u',
    user: session.user,
    project,
  });

  return res.status(200).json({ data: webhook, error: null });
};
