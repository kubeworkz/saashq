import { prisma } from '@/lib/prisma';
import { createHash, randomBytes } from 'crypto';

interface CreateApiKeyParams {
  name: string;
  projectId: string;
}

export const hashApiKey = (apiKey: string) => {
  return createHash('sha256').update(apiKey).digest('hex');
};

export const generateUniqueApiKey = () => {
  const apiKey = randomBytes(16).toString('hex');

  return [hashApiKey(apiKey), apiKey];
};

export const createApiKey = async (params: CreateApiKeyParams) => {
  const { name, projectId } = params;

  const [hashedKey, apiKey] = generateUniqueApiKey();

  await prisma.apiKey.create({
    data: {
      name,
      hashedKey: hashedKey,
      project: { connect: { id: projectId } },
    },
  });

  return apiKey;
};

export const fetchApiKeys = async (projectId: string) => {
  return prisma.apiKey.findMany({
    where: {
      projectId,
    },
  });
};

export const deleteApiKey = async (id: string) => {
  return prisma.apiKey.delete({
    where: {
      id,
    },
  });
};
