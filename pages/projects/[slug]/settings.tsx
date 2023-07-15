import { Error, Loading } from '@/components/shared';
import { AccessControl } from '@/components/shared/AccessControl';
import { RemoveProject, ProjectSettings, ProjectTab } from '@/components/project';
import useProject from 'hooks/useProject';
import type { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import type { NextPageWithLayout } from 'types';

const Settings: NextPageWithLayout = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { slug } = router.query as { slug: string };
  const { isLoading, isError, project } = useProject(slug);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  if (!project) {
    return <Error message={t('project-not-found')} />;
  }

  return (
    <>
      <ProjectTab activeTab="settings" project={project} />
      <ProjectSettings project={project} />
      <AccessControl resource="project" actions={['delete']}>
        <RemoveProject project={project} />
      </AccessControl>
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