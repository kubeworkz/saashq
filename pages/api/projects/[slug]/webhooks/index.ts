import { ApiError } from '@/lib/errors';
import { sendAudit } from '@/lib/retraced';
import {
  createWebhook,
  deleteWebhook,
  findOrCreateApp,
  listWebhooks,
} from '@/lib/svix';
import { throwIfNoProjectAccess } from 'models/project';
import { throwIfNotAllowed } from 'models/user';
import type { NextApiRequest, NextApiResponse } from 'next';
import { EndpointIn } from 'svix';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case 'POST':
        await handlePOST(req, res);
        break;
      case 'GET':
        await handleGET(req, res);
        break;
      case 'DELETE':
        await handleDELETE(req, res);
        break;
      default:
        res.setHeader('Allow', 'POST, GET, DELETE');
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

// Create a Webhook endpoint
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const projectMember = await throwIfNoProjectAccess(req, res);
  throwIfNotAllowed(projectMember, 'project_webhook', 'create');

  const { name, url, eventTypes } = req.body;

  const app = await findOrCreateApp(
    projectMember.project.name,
    projectMember.project.id
  );

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
    throw new ApiError(400, 'Bad request.');
  }

  const endpoint = await createWebhook(app.id, data);

  sendAudit({
    action: 'webhook.create',
    crud: 'c',
    user: projectMember.user,
    project: projectMember.project,
  });

  res.status(200).json({ data: endpoint });
};

// Get all webhooks created by a project
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const projectMember = await throwIfNoProjectAccess(req, res);
  throwIfNotAllowed(projectMember, 'project_webhook', 'read');

  const app = await findOrCreateApp(
    projectMember.project.name,
    projectMember.project.id
  );

  if (!app) {
    throw new ApiError(400, 'Bad request.');
  }

  const webhooks = await listWebhooks(app.id);

  res.status(200).json({ data: webhooks?.data || [] });
};

// Delete a webhook
const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const projectMember = await throwIfNoProjectAccess(req, res);
  throwIfNotAllowed(projectMember, 'project_webhook', 'delete');

  const { webhookId } = req.query as { webhookId: string };

  const app = await findOrCreateApp(
    projectMember.project.name,
    projectMember.project.id
  );

  if (!app) {
    throw new ApiError(400, 'Bad request.');
  }

  if (app.uid != projectMember.project.id) {
    throw new ApiError(400, 'Bad request.');
  }

  await deleteWebhook(app.id, webhookId);

  sendAudit({
    action: 'webhook.delete',
    crud: 'd',
    user: projectMember.user,
    project: projectMember.project,
  });

  res.status(200).json({ data: {} });
};
