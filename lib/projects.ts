import { ProjectMember, Role } from '@prisma/client';
import type { User } from 'next-auth';

export const isProjectAdmin = (user: User, members: ProjectMember[]) => {
  return (
    members.filter(
      (member) =>
        member.userId === user.id &&
        (member.role === Role.ADMIN || member.role === Role.OWNER)
    ).length > 0
  );
};
