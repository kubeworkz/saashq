import NavItem from '@/components/ui/NavItem';
import { projectNavigations } from '@/lib/projects';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';

const ProjectNav = ({ slug }: { slug: string }) => {
  const { route } = useRouter();

  const pageKey = route.split('[slug]/');

  const navigations = projectNavigations(slug, pageKey[1]);

  return (
    <>
      {navigations.map((menu) => {
        return (
          <NavItem
            href={menu.href}
            text={menu.name}
            active={menu.active}
            key={menu.href}
            icon={ArrowRightIcon}
          />
        );
      })}
    </>
  );
};

export default ProjectNav;
