import { slugify } from '@/lib/common';
import { getSession } from '@/lib/session';
import {
  checkForReservedWordOfDatabase,
  checkLengthOfDatabaseName,
} from 'knex/knex-validation';
import { createProject, getProjects, isProjectExists } from 'models/project';
import type { NextApiRequest, NextApiResponse } from 'next';

import { createDatabase } from '../../../knex/knex.config';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGET(req, res);
    case 'POST':
      return handlePOST(req, res);
    default:
      res.setHeader('Allow', 'GET, POST');
      res.status(405).json({
        data: null,
        error: { message: `Method ${method} Not Allowed` },
      });
  }
}

// Get projects
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession(req, res);

  const projects = await getProjects(session?.user.id as string);

  return res.status(200).json({ data: projects, error: null });
};

// Create a project
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name } = req.body;

  const session = await getSession(req, res);

  const slug = slugify(name);

  if (await isProjectExists({ slug })) {
    return res.status(400).json({
      data: null,
      error: {
        message: 'A project with this name already exists.',
      },
    });
  }

  if (await checkLengthOfDatabaseName(name)) {
    return res.status(400).json({
      data: null,
      error: {
        message: `'${name}' is too long. Please select shorter name.`,
      },
    });
  }

  if (await checkForReservedWordOfDatabase(name)) {
    return res.status(400).json({
      data: null,
      error: {
        message: `'${name}' is too long. Please select shorter name.`,
      },
    });
  }

  if (await createDatabase(name)) {
    const project = await createProject({
      userId: session?.user?.id as string,
      name,
      slug,
    });
    return res.status(200).json({ data: project, error: null });
  } else {
    return res.status(400).json({
      data: null,
      error: { message: `Database '${name}' is already exist.` },
    });
  }
};
