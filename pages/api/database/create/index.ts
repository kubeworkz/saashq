import { getSession } from '@/lib/session';
import { createDatabaseAndProjectModification } from 'models/database';
import { getProject } from 'models/project';
import type { NextApiRequest, NextApiResponse } from 'next';

import {
  checkForReservedWordOfDatabase,
  checkLengthOfDatabaseName,
} from '../../../../knex/knex-validation';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'POST':
      return handlePOST(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({
        data: null,
        error: { message: `Method ${method} Not Allowed` },
      });
  }
}

// Create a database
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { data } = req.body;
  const id = data as string;

  const session = await getSession(req, res);
  if (!session) {
    return res.status(401).json({
      error: { message: 'Unauthorized.' },
    });
  }

  const existingProject = await getProject({ id });

  if (await checkLengthOfDatabaseName(existingProject.name)) {
    return res.status(400).json({
      data: null,
      error: {
        message: `'${name}' is too long. Please select shorter name.`,
      },
    });
  }

  if (await checkForReservedWordOfDatabase(existingProject.name)) {
    return res.status(400).json({
      data: null,
      error: {
        message: `'${name}' is too long. Please select shorter name.`,
      },
    });
  }

  const project = await createDatabaseAndProjectModification({
    projectId: id as string,
    name: existingProject.name,
  });
  return res.status(200).json({ data: project, error: null });
};
