import { prisma } from '@/lib/prisma';
import { Project } from '@prisma/client';

import { createDatabase } from '../knex/knex.config';

export const createDatabaseAndProjectModification = async (param: {
  projectId: string;
  name: string;
}) => {
  const { name, projectId } = param;
  try {
    if (await createDatabase(name)) {
      const connectionString = process.env.CONNECTION_URL + `${name}`;

      //update connectionString logic
      return await updateProjectConnectionString(projectId, {
        connectionString: connectionString,
      });
    }
  } catch (error) {
    console.error(`Error :`, error);
    return;
  }
};

export const updateProjectConnectionString = async (
  id: string,
  data: Partial<Project>
) => {
  return await prisma.project.update({
    where: {
      id,
    },
    data: data,
  });
};
