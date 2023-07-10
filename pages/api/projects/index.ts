import { slugify } from '@/lib/common';
import { getSession } from '@/lib/session';
import {
  checkForReservedWordOfDatabase,
  checkLengthOfDatabaseName,
} from 'knex/knex-validation';
import { createProject, getProjects, isProjectExists } from 'models/project';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiError } from 'next/dist/server/api-utils';

import { createDatabase } from '../../../knex/knex.config';

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

// Get projects
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession(req, res);

  const projects = await getProjects(session?.user.id as string);

  res.status(200).json({ data: projects });
};

// Create a project
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name } = req.body;

  const session = await getSession(req, res);

  const slug = slugify(name);

  if (await isProjectExists({ slug })) {
    throw new ApiError(400, 'A project with this name already exists.');
  }

  const project = await createProject({
    userId: session?.user?.id as string,
    name,
    slug,
  });

  res.status(200).json({ data: project });

  if (checkLengthOfDatabaseName(name)) {
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
        message: `'${name}' is reserved. Please select another name.`,
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
