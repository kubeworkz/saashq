import {
  ChevronUpDownIcon,
  CodeBracketIcon,
  Cog6ToothIcon,
  FolderIcon,
  FolderPlusIcon,
  LockClosedIcon,
  RectangleStackIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import useProjects from 'hooks/useProjects';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import NavItem from './NavItem';

export default function Sidebar() {
  const router = useRouter();
  const { t } = useTranslation('common');

  const { slug } = router.query;

  const sidebarMenus = {
    personal: [
      {
        name: t('all-projects'),
        href: '/projects',
        icon: RectangleStackIcon,
      },
      {
        name: t('account'),
        href: '/settings/account',
        icon: UserCircleIcon,
      },
      {
        name: t('password'),
        href: '/settings/password',
        icon: LockClosedIcon,
      },
    ],
    project: [
      {
        name: t('database'),
        href: `/projects/${slug}/products`,
        icon: CodeBracketIcon,
      },
      {
        name: t('settings'),
        href: `/projects/${slug}/settings`,
        icon: Cog6ToothIcon,
      },
    ],
  };

  const menus = sidebarMenus[slug ? 'project' : 'personal'];

  return (
    <>
      <aside
        className="transition-width fixed top-0 left-0 z-20 flex h-full w-64 flex-shrink-0 flex-col pt-12 duration-75 lg:flex"
        aria-label="Sidebar"
      >
        <div className="relative flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white pt-0">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex-1 space-y-1 divide-y bg-white">
              <ProjectDropdown />
              <div className="p-4">
                <ul className="space-y-1">
                  {menus.map((item) => (
                    <li key={item.name}>
                      <NavItem
                        href={item.href}
                        text={t(item.name)}
                        icon={item.icon}
                        active={router.asPath === item.href}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <div
        className="fixed inset-0 z-10 hidden bg-gray-900 opacity-50"
        id="sidebarBackdrop"
      />
    </>
  );
}

const ProjectDropdown = () => {
  const router = useRouter();

  const { projects } = useProjects();
  const { data } = useSession();
  const { t } = useTranslation('common');

  const currentProject = (projects || []).find(
    (project) => project.slug === router.query.slug
  );

  const menus = [
    {
      id: 1,
      name: t('profile'),
      items: [
        {
          id: data?.user.id,
          name: data?.user?.name,
          href: '/settings/account',
          icon: UserCircleIcon,
        },
      ],
    },
    {
      id: 2,
      name: t('projects'),
      items: (projects || []).map((project) => ({
        id: project.id,
        name: project.name,
        href: `/projects/${project.slug}/settings`,
        icon: FolderIcon,
      })),
    },
    {
      id: 3,
      name: '',
      items: [
        {
          id: t('all-projects'),
          name: t('all-projects'),
          href: '/projects',
          icon: RectangleStackIcon,
        },
        {
          id: t('new-project'),
          name: t('new-project'),
          href: '/projects?newProject=true',
          icon: FolderPlusIcon,
        },
      ],
    },
  ];

  return (
    <div className="px-4 py-2">
      <div className="flex">
        <div className="dropdown w-full">
          <div
            tabIndex={0}
            className="border border-gray-300 flex h-10 items-center px-4 justify-between cursor-pointer rounded text-sm font-bold"
          >
            {currentProject?.name || data?.user?.name}{' '}
            <ChevronUpDownIcon className="w-5 h-5" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content p-2 shadow-md bg-base-100 w-full rounded border px-2"
          >
            {menus.map(({ id, name, items }) => {
              return (
                <React.Fragment key={id}>
                  {name && (
                    <li
                      className="text-xs text-gray-500 py-1 px-2"
                      key={`${id}-name`}
                    >
                      {name}
                    </li>
                  )}
                  {items.map((item) => (
                    <li
                      key={`${id}-${item.id}`}
                      onClick={() => {
                        if (document.activeElement) {
                          (document.activeElement as HTMLElement).blur();
                        }
                      }}
                    >
                      <Link href={item.href}>
                        <div className="flex hover:bg-gray-100 focus:bg-gray-100 focus:outline-none py-2 px-2 rounded text-sm font-medium gap-2 items-center">
                          <item.icon className="w-5 h-5" /> {item.name}
                        </div>
                      </Link>
                    </li>
                  ))}
                  {name && <li className="divider m-0" key={`${id}-divider`} />}
                </React.Fragment>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};