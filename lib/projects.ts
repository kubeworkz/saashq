import {
  Cog6ToothIcon,
  DocumentMagnifyingGlassIcon,
  KeyIcon,
  PaperAirplaneIcon,
  ShieldExclamationIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { Role, ProjectMember } from '@prisma/client';
import type { User } from 'next-auth';

export const isTeamAdmin = (user: User, members: ProjectMember[]) => {
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
      name: 'Settings',
      href: `/projects/${slug}/settings`,
      active: activeTab === 'settings',
      icon: Cog6ToothIcon,
    },
    {
      name: 'Members',
      href: `/projects/${slug}/members`,
      active: activeTab === 'members',
      icon: UserPlusIcon,
    },
    {
      name: 'Single Sign-On',
      href: `/projects/${slug}/saml`,
      active: activeTab === 'saml',
      icon: ShieldExclamationIcon,
    },
    {
      name: 'Directory Sync',
      href: `/projects/${slug}/directory-sync`,
      active: activeTab === 'directory-sync',
      icon: UserPlusIcon,
    },
    {
      name: 'Audit Logs',
      href: `/projects/${slug}/audit-logs`,
      active: activeTab === 'audit-logs',
      icon: DocumentMagnifyingGlassIcon,
    },
    {
      name: 'Webhooks',
      href: `/projects/${slug}/webhooks`,
      active: activeTab === 'webhooks',
      icon: PaperAirplaneIcon,
    },
    {
      name: 'API Keys',
      href: '#',
      active: activeTab === 'api-keys',
      icon: KeyIcon,
    },
  ];
};