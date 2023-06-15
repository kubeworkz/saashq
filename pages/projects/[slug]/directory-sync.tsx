import {
  CreateDirectory,
  Directory,
} from '@/components/interfaces/DirectorySync';
import { ProjectTab } from '@/components/interfaces/Project';
import { Card } from '@/components/ui';
import { Error, Loading } from '@/components/ui';
import useDirectory from 'hooks/useDirectory';
import useProject from 'hooks/useProject';
import { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button } from 'react-daisyui';
import type { NextPageWithLayout } from 'types';

const DirectorySync: NextPageWithLayout = () => {
  const router = useRouter();
  const { slug } = router.query as { slug: string };

  const [visible, setVisible] = useState(false);
  const { isLoading, isError, project } = useProject(slug);
  const { directories } = useDirectory(slug);
  const { t } = useTranslation('common');

  if (isLoading || !project) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  const directory =
    directories && directories.length > 0 ? directories[0] : null;

  return (
    <>
      <ProjectTab activeTab="directory-sync" project={project} />
      <Card heading="Directory Sync">
        <Card.Body className="px-3 py-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm">{t('provision')}</p>
            {directory === null ? (
              <Button onClick={() => setVisible(!visible)} variant="outline">
                {t('enable')}
              </Button>
            ) : (
              <Button
                onClick={() => setVisible(!visible)}
                variant="outline"
                color="error"
                disabled
              >
                {t('remove')}
              </Button>
            )}
          </div>
          <Directory project={project} />
        </Card.Body>
      </Card>
      <CreateDirectory visible={visible} setVisible={setVisible} project={project} />
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

export default DirectorySync;