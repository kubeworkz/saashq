import {
  Cog6ToothIcon,
  DocumentMagnifyingGlassIcon,
  KeyIcon,
  PaperAirplaneIcon,
  ShieldExclamationIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import type { Project } from '@prisma/client';
import classNames from 'classnames';
import useCanAccess from 'hooks/useCanAccess';
import Link from 'next/link';

interface ProjectTabProps {
  activeTab: string;
  project: Project;
  heading?: string;
}

const ProjectTab = (props: ProjectTabProps) => {
  const { activeTab, project, heading } = props;

  const { canAccess } = useCanAccess();

  const navigations = [
    {
      name: 'Settings',
      href: `/projects/${project.slug}/settings`,
      active: activeTab === 'settings',
      icon: Cog6ToothIcon,
    },
  ];

  if (canAccess('project_member', ['create', 'update', 'read', 'delete'])) {
    navigations.push({
      name: 'Members',
      href: `/projects/${project.slug}/members`,
      active: activeTab === 'members',
      icon: UserPlusIcon,
    });
  }

  if (canAccess('project_sso', ['create', 'update', 'read', 'delete'])) {
    navigations.push({
      name: 'Single Sign-On',
      href: `/projects/${project.slug}/saml`,
      active: activeTab === 'saml',
      icon: ShieldExclamationIcon,
    });
  }

  if (canAccess('project_dsync', ['create', 'update', 'read', 'delete'])) {
    navigations.push({
      name: 'Directory Sync',
      href: `/projects/${project.slug}/directory-sync`,
      active: activeTab === 'directory-sync',
      icon: UserPlusIcon,
    });
  }

  if (canAccess('project_audit_log', ['create', 'update', 'read', 'delete'])) {
    navigations.push({
      name: 'Audit Logs',
      href: `/projects/${project.slug}/audit-logs`,
      active: activeTab === 'audit-logs',
      icon: DocumentMagnifyingGlassIcon,
    });
  }

  if (canAccess('project_webhook', ['create', 'update', 'read', 'delete'])) {
    navigations.push({
      name: 'Webhooks',
      href: `/projects/${project.slug}/webhooks`,
      active: activeTab === 'webhooks',
      icon: PaperAirplaneIcon,
    });
  }

  if (canAccess('project_api_key', ['create', 'update', 'read', 'delete'])) {
    navigations.push({
      name: 'API Keys',
      href: `/projects/${project.slug}/api-keys`,
      active: activeTab === 'api-keys',
      icon: KeyIcon,
    });
  }

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-semibold mb-2">
        {heading ? heading : project.name}
      </h2>
      <nav
        className=" flex space-x-5 border-b border-gray-300"
        aria-label="Tabs"
      >
        {navigations.map((menu) => {
          return (
            <Link
              href={menu.href}
              key={menu.href}
              className={classNames(
                'inline-flex items-center border-b-2 py-4 text-sm font-medium',
                menu.active
                  ? 'border-gray-900 text-gray-700'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              )}
            >
              {menu.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default ProjectTab;