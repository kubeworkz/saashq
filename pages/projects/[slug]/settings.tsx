import {
  RemoveProject,
  ProjectSettings,
  ProjectTab,
} from '@/components/interfaces/Project';
import { Error, Loading } from '@/components/ui';
import useProject from 'hooks/useProject';
import type { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import type { NextPageWithLayout } from 'types';

const Settings: NextPageWithLayout = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { isLoading, isError, project } = useProject(slug as string);

  if (isLoading || !project) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <h3 className="text-2xl font-bold">{project.name}</h3>
      <ProjectTab project={project} activeTab="settings" />
      <ProjectSettings project={project} />
      <RemoveProject project={project} />
    </>
  );
};

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default Settings;
