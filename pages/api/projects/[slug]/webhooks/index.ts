import { sendAudit } from '@/lib/retraced';
import { getSession } from '@/lib/session';
import {
  createWebhook,
  deleteWebhook,
  findOrCreateApp,
  listWebhooks,
} from '@/lib/svix';
import { getProject, isProjectMember } from 'models/project';
import type { NextApiRequest, NextApiResponse } from 'next';
import { EndpointIn } from 'svix';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'POST':
      return handlePOST(req, res);
    case 'GET':
      return handleGET(req, res);
    case 'DELETE':
      return handleDELETE(req, res);
    default:
      res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
      res.status(405).json({
        data: null,
        error: { message: `Method ${method} Not Allowed` },
      });
  }
}

// Create a Webhook endpoint
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const slug = req.query.slug as string;
  const { name, url, eventTypes } = req.body;

  const session = await getSession(req, res);

  if (!session) {
    return res.status(401).json({
      error: { message: 'Unauthorized.' },
    });
  }

  const project = await getProject({ slug });

  if (!(await isProjectMember(session.user.id, project?.id))) {
    return res.status(200).json({
      data: null,
      error: { message: 'Bad request.' },
    });
  }

  const app = await findOrCreateApp(project.name, project.id);

  // TODO: The endpoint URL must be HTTPS.

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

  const endpoint = await createWebhook(app.id, data);

  sendAudit({
    action: 'webhook.create',
    crud: 'c',
    user: session.user,
    project,
  });

  return res.status(200).json({ data: endpoint, error: null });
};

// Get all webhooks created by a team
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const slug = req.query.slug as string;

  const session = await getSession(req, res);
  const userId = session?.user?.id as string;

  const project = await getProject({ slug });

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

  const webhooks = await listWebhooks(app.id);

  if (!webhooks) {
    return res.status(200).json({
      data: null,
      error: { message: 'Bad request.' },
    });
  }

  return res.status(200).json({ data: webhooks.data, error: null });
};

// Delete a webhook
const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug, webhookId } = req.query as { slug: string; webhookId: string };

  const session = await getSession(req, res);

  if (!session) {
    return res.status(401).json({
      error: { message: 'Unauthorized.' },
    });
  }

  const project = await getProject({ slug });

  if (!(await isProjectMember(session.user.id, project?.id))) {
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

  if (app.uid != project.id) {
    return res.status(200).json({
      data: null,
      error: { message: 'Bad request.' },
    });
  }

  await deleteWebhook(app.id, webhookId);

  sendAudit({
    action: 'webhook.delete',
    crud: 'd',
    user: session.user,
    project,
  });

  return res.status(200).json({ data: {}, error: null });
};
