import env from '@/lib/env';
import jackson from '@/lib/jackson';
import { sendAudit } from '@/lib/retraced';
import { getSession } from '@/lib/session';
import { getProject, isProjectMember } from 'models/project';
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
    default:
      res.setHeader('Allow', 'GET, POST');
      res.status(405).json({
        error: { message: `Method ${method} Not Allowed` },
      });
  }
}

const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query as { slug: string };

  const session = await getSession(req, res);

  if (!session) {
    return res.status(401).json({ error: { message: 'Unauthorized' } });
  }

  const project = await getProject({ slug });

  if (!(await isProjectMember(session.user.id, project?.id))) {
    return res.status(400).json({
      error: { message: 'Bad request.' },
    });
  }

  const { directorySync } = await jackson();

  const { data, error } = await directorySync.directories.getByTenantAndProduct(
    project.id,
    env.product
  );

  if (error) {
    return res.status(400).json({ error });
  }

  return res.status(200).json({ data });
};

const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, provider } = req.body;
  const { slug } = req.query;

  const { directorySync } = await jackson();

  const session = await getSession(req, res);

  if (!session) {
    return res.status(401).json({
      error: { message: 'Unauthorized.' },
    });
  }

  const project = await getProject({ slug: slug as string });

  if (!(await isProjectMember(session.user.id, project?.id))) {
    return res.status(400).json({
      data: null,
      error: { message: 'Bad request.' },
    });
  }

  const { data, error } = await directorySync.directories.create({
    name,
    type: provider,
    tenant: project.id,
    product: env.product,
  });

  sendAudit({
    action: 'dsync.connection.create',
    crud: 'c',
    user: session.user,
    project,
  });

  return res.status(201).json({ data, error });
};
