import { prisma } from '@/lib/prisma';
import { findOrCreateApp } from '@/lib/svix';
import { Role, Project } from '@prisma/client';

export const createProject = async (param: {
  userId: string;
  name: string;
  slug: string;
}) => {
  const { userId, name, slug } = param;

  const project = await prisma.project.create({
    data: {
      name,
      slug,
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
  return await prisma.projectMember.create({
    data: {
      userId,
      projectId,
      role,
    },
  });
};

export const removeProjectMember = async (projectId: string, userId: string) => {
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

// Check if the user is a member of the project
export async function isProjectMember(userId: string, projectId: string) {
  const projectMember = await prisma.projectMember.findFirstOrThrow({
    where: {
      userId,
      projectId,
    },
  });

  return (
    projectMember.role === Role.MEMBER ||
    projectMember.role === Role.OWNER ||
    projectMember.role === Role.ADMIN
  );
}

// Check if the user is an owner of the project
export async function isProjectOwner(userId: string, projectId: string) {
  const projectMember = await prisma.projectMember.findFirstOrThrow({
    where: {
      userId,
      projectId,
    },
  });

  return projectMember.role === Role.OWNER;
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
