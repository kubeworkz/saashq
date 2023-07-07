import { getSession } from '@/lib/session';
import { getProject, updateProjectConnectionString } from 'models/project';
import type { NextApiRequest, NextApiResponse } from 'next';

import {
  checkDatabaseExists,
  dropDatabase,
} from '../../../../../knex/knex.config';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'DELETE':
      return handleDELETE(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({
        data: null,
        error: { message: `Method ${method} Not Allowed` },
      });
  }
}
// Delete a project
const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id as string;

  const session = await getSession(req, res);
  if (!session) {
    return res.status(401).json({
      error: { message: 'Unauthorized.' },
    });
  }

  const project = await getProject({ id });

  //Drop database
  try {
    const existDatabase = await checkDatabaseExists(project.name);
    if (existDatabase === false) {
      //Remove connectionString from project table
      await updateProjectConnectionString(project.id, {
        connectionString: null,
      });

      return res.status(400).json({
        data: null,
        error: { message: `Database already dropped.` },
      });
    }

    if (project.connectionString) {
      if (await dropDatabase(project.name)) {
        //Remove connectionString from project table
        await updateProjectConnectionString(project.id, {
          connectionString: null,
        });

        return res.status(200).json({
          data: { message: `Database dropped succesfully.` },
          error: null,
        });
      }
    } else {
      return res.status(400).json({
        data: { message: `Database already dropped.` },
        error: null,
      });
    }
  } catch (error) {
    console.error(`Error : ${error}`);
  }
};
