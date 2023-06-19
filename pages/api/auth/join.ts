import { hashPassword } from '@/lib/auth';
import { slugify } from '@/lib/common';
import { sendWelcomeEmail } from '@/lib/email/sendWelcomeEmail';
import {
  checkForReservedWordOfDatabase,
  checkLengthOfDatabaseName,
} from 'knex/knex-validation';
import { createProject, isProjectExists } from 'models/project';
import { createUser, getUser } from 'models/user';
import type { NextApiRequest, NextApiResponse } from 'next';

import { createDatabase } from '../../../knex/knex.config';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'POST':
      return await handlePOST(req, res);
    default:
      res.setHeader('Allow', 'POST');
      res.status(405).json({
        error: { message: `Method ${method} Not Allowed` },
      });
  }
}

// Signup the user
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email, password, project } = req.body;

  const existingUser = await getUser({ email });

  if (existingUser) {
    return res.status(400).json({
      error: {
        message:
          'A user with this email already exists or the email was invalid.',
      },
    });
  }

  // Create a new project
  if (project) {
    const slug = slugify(project);

    const nameCollisions = await isProjectExists([{ name: project }, { slug }]);

    if (nameCollisions > 0) {
      return res.status(400).json({
        error: {
          message: 'A project with this name already exists in our database.',
        },
      });
    }
  }

  const user = await createUser({
    name,
    email,
    password: await hashPassword(password),
  });

  if (await checkLengthOfDatabaseName(project)) {
    return res.status(400).json({
      data: null,
      error: {
        message: `'${name}' is too long. Please select shorter name.`,
      },
    });
  }

  if (await checkForReservedWordOfDatabase(project)) {
    return res.status(400).json({
      data: null,
      error: {
        message: `'${name}' is too long. Please select shorter name.`,
      },
    });
  }

  if (project) {
    if (await createDatabase(project)) {
      const slug = slugify(project);

      await createProject({
        userId: user.id,
        name: project,
        slug,
      });
    }
    await sendWelcomeEmail(name, email, project);
  }

  return res.status(201).json({ data: user });
};
