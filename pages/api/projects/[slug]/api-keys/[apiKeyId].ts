import { ApiError } from '@/lib/errors';
import { getSession } from '@/lib/session';
import { createApiKey, fetchApiKeys } from 'models/apiKey';
import { getProject, hasProjectAccess } from 'models/project';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        return await handleGET(req, res);
      case 'POST':
        return await handlePOST(req, res);
      default:
        res.setHeader('Allow', 'GET, POST');
        res.status(405).json({
          data: null,
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
  const session = await getSession(req, res);

  if (!session) {
    throw new ApiError(401, 'Unauthorized.');
  }

  const { slug } = req.query as { slug: string };

  if (
    !(await hasProjectAccess({ userId: session.user.id, projectSlug: slug }))
  ) {
    throw new ApiError(403, 'You are not allowed to perform this action');
  }

  const project = await getProject({ slug });
  const apiKeys = await fetchApiKeys(project.id);

  return res.json({ data: apiKeys });
};

// Create an API key
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession(req, res);

  if (!session) {
    throw new ApiError(401, 'Unauthorized.');
  }

  const { slug } = req.query as { slug: string };
  const { name } = JSON.parse(req.body) as { name: string };

  if (
    !(await hasProjectAccess({ userId: session.user.id, projectSlug: slug }))
  ) {
    throw new ApiError(403, 'You are not allowed to perform this action');
  }

  const project = await getProject({ slug });
  const apiKey = await createApiKey({
    name,
    projectId: project.id,
  });

  return res.status(201).json({ data: { apiKey } });
};
