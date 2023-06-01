import { Role, ProjectMember } from '@prisma/client';
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

export const projectNavigations = (slug: string, activeTab: string) => {
  return [
    {
      name: 'Members',
      href: `/projects/${slug}/members`,
      active: activeTab === 'members',
    },
    {
      name: 'Settings',
      href: `/projects/${slug}/settings`,
      active: activeTab === 'settings',
    },
    {
      name: 'SAML SSO',
      href: `/projects/${slug}/saml`,
      active: activeTab === 'saml',
    },
    {
      name: 'Directory Sync (SCIM)',
      href: `/projects/${slug}/directory-sync`,
      active: activeTab === 'directory-sync',
    },
    {
      name: 'Audit Logs',
      href: `/projects/${slug}/audit-logs`,
      active: activeTab === 'audit-logs',
    },
    {
      name: 'Webhooks',
      href: `/projects/${slug}/webhooks`,
      active: activeTab === 'webhooks',
    },
  ];
};
