import type { Prisma } from '@prisma/client';

export type ApiError = {
  code?: string;
  message: string;
  values: { [key: string]: string };
};

export type ApiResponse<T = unknown> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: ApiError;
    };

export type Role = 'owner' | 'member';

export type SPSAMLConfig = {
  issuer: string;
  acs: string;
};

export type ProjectWithMemberCount = Prisma.ProjectGetPayload<{
  include: {
    _count: {
      select: { members: true };
    };
  };
}>;

export type WebookFormSchema = {
  name: string;
  url: string;
  eventTypes: string[];
};
