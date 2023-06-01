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

// Get the SAML connection for the project.
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query as { slug: string };

  const session = await getSession(req, res);

  if (!session) {
    return res.status(401).json({
      error: { message: 'Unauthorized.' },
    });
  }

  const project = await getProject({ slug });

  if (!(await isProjectMember(session.user.id, project.id))) {
    return res.status(400).json({
      error: { message: 'Bad request.' },
    });
  }

  const { apiController } = await jackson();

  try {
    const connections = await apiController.getConnections({
      tenant: project.id,
      product: env.product,
    });

    const connection = {
      config: connections.length > 0 ? connections[0] : [],
      issuer: env.saml.issuer,
      acs: env.saml.acs,
    };

    return res.json({ data: connection });
  } catch (error: any) {
    const { message } = error;

    return res.status(500).json({ error: { message } });
  }
};

// Create a SAML connection for the project.
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query as { slug: string };
  const { encodedRawMetadata } = req.body;

  const session = await getSession(req, res);

  if (!session) {
    return res.status(401).json({
      error: { message: 'Unauthorized.' },
    });
  }

  const project = await getProject({ slug });

  if (!(await isProjectMember(session.user.id, project.id))) {
    return res.status(400).json({
      error: { message: 'Bad request.' },
    });
  }

  const { apiController } = await jackson();

  try {
    const connection = await apiController.createSAMLConnection({
      encodedRawMetadata,
      defaultRedirectUrl: env.saml.callback,
      redirectUrl: env.saml.callback,
      tenant: project.id,
      product: env.product,
    });

    sendAudit({
      action: 'sso.connection.create',
      crud: 'c',
      user: session.user,
      project,
    });

    return res.status(201).json({ data: connection });
  } catch (error: any) {
    const { message } = error;

    return res.status(500).json({ error: { message } });
  }
};
