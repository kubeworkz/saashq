import { Error, Loading } from '@/components/shared';
import { ProjectTab } from '@/components/project';
import useProject from 'hooks/useProject';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button } from 'react-daisyui';
import type { NextPageWithLayout } from 'types';

import APIKeys from './APIKeys';
import NewAPIKey from './NewAPIKey';

const APIKeysContainer: NextPageWithLayout = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const { slug } = router.query as { slug: string };

  const { isLoading, isError, project } = useProject(slug);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  if (!project) {
    return <Error message="Project not found" />;
  }

  return (
    <>
      <ProjectTab activeTab="api-keys" project={project} />
      <div className="flex flex-col space-y-4">
        <div className="flex justify-end mt-4">
          <Button
            color="primary"
            size="sm"
            variant="outline"
            onClick={() => setCreateModalVisible(true)}
          >
            {t('new-api-key')}
          </Button>
        </div>
        <APIKeys project={project} />
      </div>
      <NewAPIKey
        project={project}
        createModalVisible={createModalVisible}
        setCreateModalVisible={setCreateModalVisible}
      />
    </>
  );
};

export default APIKeysContainer;