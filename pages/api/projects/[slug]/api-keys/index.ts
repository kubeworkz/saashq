import { createApiKey, fetchApiKeys } from 'models/apiKey';
import { throwIfNoProjectAccess } from 'models/project';
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
      default:
        res.setHeader('Allow', 'GET, POST');
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

// Get API keys
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const projectMember = await throwIfNoProjectAccess(req, res);
  throwIfNotAllowed(projectMember, 'project_api_key', 'read');

  const apiKeys = await fetchApiKeys(projectMember.projectId);

  res.json({ data: apiKeys });
};

// Create an API key
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const projectMember = await throwIfNoProjectAccess(req, res);
  throwIfNotAllowed(projectMember, 'project_api_key', 'create');

  const { name } = JSON.parse(req.body) as { name: string };

  const apiKey = await createApiKey({
    name,
    projectId: projectMember.projectId,
  });

  res.status(201).json({ data: { apiKey } });
};
