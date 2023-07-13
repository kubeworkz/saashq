import env from '@/lib/env';
import jackson from '@/lib/jackson';
import { sendAudit } from '@/lib/retraced';
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
      case 'DELETE':
        await handleDELETE(req, res);
        break;
      default:
        res.setHeader('Allow', 'GET, POST, DELETE');
        res.status(405).json({
          error: { message: `Method ${method} Not Allowed` },
        });
    }
  } catch (err: any) {
    const message = err.message || 'Something went wrong';
    const status = err.status || 500;

    res.status(status).json({ error: { message } });
  }
}

// Get the SAML connection for the project.
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const projectMember = await throwIfNoProjectAccess(req, res);
  throwIfNotAllowed(projectMember, 'project_sso', 'read');

  const { apiController } = await jackson();

  const connections = await apiController.getConnections({
    tenant: projectMember.projectId,
    product: env.product,
  });

  const response = {
    connections,
    issuer: env.saml.issuer,
    acs: `${env.appUrl}${env.saml.path}`,
  };

  res.json({ data: response });
};

// Create a SAML connection for the project.
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const projectMember = await throwIfNoProjectAccess(req, res);
  throwIfNotAllowed(projectMember, 'project_sso', 'create');

  const { metadataUrl, encodedRawMetadata } = req.body;

  const { apiController } = await jackson();

  const connection = await apiController.createSAMLConnection({
    encodedRawMetadata,
    metadataUrl,
    defaultRedirectUrl: env.saml.callback,
    redirectUrl: env.saml.callback,
    tenant: projectMember.projectId,
    product: env.product,
  });

  sendAudit({
    action: 'sso.connection.create',
    crud: 'c',
    user: projectMember.user,
    project: projectMember.project,
  });

  res.status(201).json({ data: connection });
};

const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const projectMember = await throwIfNoProjectAccess(req, res);
  throwIfNotAllowed(projectMember, 'project_sso', 'delete');

  const { clientID, clientSecret } = req.query as {
    clientID: string;
    clientSecret: string;
  };

  const { apiController } = await jackson();

  await apiController.deleteConnections({ clientID, clientSecret });

  sendAudit({
    action: 'sso.connection.delete',
    crud: 'c',
    user: projectMember.user,
    project: projectMember.project,
  });

  res.json({ data: {} });
};
