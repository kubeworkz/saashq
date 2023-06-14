import {
  HashtagIcon,
  HomeIcon,
  LockClosedIcon,
  UserCircleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import useTeam from 'hooks/useProject';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import TeamNav from '../interfaces/Project/ProjectNav';
import NavItem from './NavItem';

export default function Sidebar() {
  const router = useRouter();
  const { t } = useTranslation('common');

  const { slug } = router.query as { slug: string };
  const { project } = useTeam(slug);

  const navigation = [
    {
      name: t('dashboard'),
      href: '/dashboard',
      icon: HomeIcon,
    },
    {
      name: t('projects'),
      href: '/projects',
      icon: UsersIcon,
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
  ];

  return (
    <>
      <aside
        className="transition-width fixed top-0 left-0 z-20 flex h-full w-64 flex-shrink-0 flex-col pt-12 duration-75 lg:flex"
        aria-label="Sidebar"
      >
        <div className="relative flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white pt-0">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex-1 space-y-1 divide-y bg-white px-3">
              <ul className="space-y-2 pb-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavItem
                      href={item.href}
                      text={item.name}
                      icon={item.icon}
                      active={router.pathname === item.href}
                    />
                  </li>
                ))}
              </ul>
              {project && (
                <div className="space-y-2 pt-2">
                  <span className="p-2 text-sm font-semibold flex gap-2">
                    <HashtagIcon className="h-5 w-5" />
                    {project.name}
                  </span>
                  <TeamNav slug={slug} />
                </div>
              )}
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