import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { findOrCreateApp } from '@/lib/svix';
import { Project, Role } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

export const createProject = async (param: {
  userId: string;
  name: string;
  slug: string;
}) => {
  const { userId, name, slug } = param;

  const connectionString = process.env.CONNECTION_URL + `${name}`;
  const project = await prisma.project.create({
    data: {
      name,
      slug,
      connectionString,
    },
  });

  await addProjectMember(project.id, userId, Role.OWNER);

  await findOrCreateApp(project.name, project.id);

  return project;
};

export const getProject = async (key: { id: string } | { slug: string }) => {
  return await prisma.project.findUniqueOrThrow({
    where: key,
  });
};

export const deleteProject = async (key: { id: string } | { slug: string }) => {
  return await prisma.project.delete({
    where: key,
  });
};

export const addProjectMember = async (
  projectId: string,
  userId: string,
  role: Role
) => {
  return await prisma.projectMember.upsert({
    create: {
      projectId,
      userId,
      role,
    },
    update: {
      role,
    },
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });
};

export const removeProjectMember = async (
  projectId: string,
  userId: string
) => {
  return await prisma.projectMember.delete({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });
};

export const getProjects = async (userId: string) => {
  return await prisma.project.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      _count: {
        select: { members: true },
      },
    },
  });
};

export async function getProjectRoles(userId: string) {
  const projectRoles = await prisma.projectMember.findMany({
    where: {
      userId,
    },
    select: {
      projectId: true,
      role: true,
    },
  });

  return projectRoles;
}

// Check if the user is an admin or owner of the project
export async function isProjectAdmin(userId: string, projectId: string) {
  const projectMember = await prisma.projectMember.findFirstOrThrow({
    where: {
      userId,
      projectId,
    },
  });

  return projectMember.role === Role.ADMIN || projectMember.role === Role.OWNER;
}

export const getProjectMembers = async (slug: string) => {
  return await prisma.projectMember.findMany({
    where: {
      project: {
        slug,
      },
    },
    include: {
      user: true,
    },
  });
};

export const updateProject = async (slug: string, data: Partial<Project>) => {
  return await prisma.project.update({
    where: {
      slug,
    },
    data: data,
  });
};

export const isProjectExists = async (condition: any) => {
  return await prisma.project.count({
    where: {
      OR: condition,
    },
  });
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

// Check if the current user has access to the project
// Should be used in API routes to check if the user has access to the project
export const throwIfNoProjectAccess = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getSession(req, res);

  if (!session) {
    throw new Error('Unauthorized');
  }

  const projectMember = await getProjectMember(
    session.user.id,
    req.query.slug as string
  );

  if (!projectMember) {
    throw new Error('You do not have access to this project');
  }

  return {
    ...projectMember,
    user: {
      ...session.user,
    },
  };
};

// Get the current user's project member object
export const getProjectMember = async (userId: string, slug: string) => {
  const projectMember = await prisma.projectMember.findFirstOrThrow({
    where: {
      userId,
      project: {
        slug,
      },
      role: {
        in: ['ADMIN', 'MEMBER', 'OWNER'],
      },
    },
    include: {
      project: true,
    },
  });

  return projectMember;
};
