import { projectNavigations } from '@/lib/projects';
import type { Project } from '@prisma/client';
import classNames from 'classnames';
import Link from 'next/link';

interface ProjectTabProps {
  activeTab: string;
  project: Project;
  heading?: string;
}

const ProjectTab = (props: ProjectTabProps) => {
  const { activeTab, project, heading } = props;

  const navigations = projectNavigations(project.slug, activeTab);

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