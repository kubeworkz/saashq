import { ProjectTab } from '@/components/project';
import { CreateWebhook, Webhooks } from '@/components/webhook';
import { Error, Loading } from '@/components/shared';
import useProject from 'hooks/useProject';
import { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button } from 'react-daisyui';
import type { NextPageWithLayout } from 'types';

const WebhookList: NextPageWithLayout = () => {
  const router = useRouter();
  const slug = router.query.slug as string;
  const { t } = useTranslation('common');

  const [visible, setVisible] = useState(false);

  const { isLoading, isError, project } = useProject(slug);

  if (isLoading || !project) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <ProjectTab activeTab="webhooks" project={project} />
      <div className="flex flex-col">
        <div className="flex mt-2 justify-end">
          <Button
            variant="outline"          
            color="primary"
            size="sm"            
            onClick={() => {
              setVisible(!visible);
            }}
          >
            {t('add-webhook')}
          </Button>
        </div>
        <Webhooks project={project} />
      </div>
      <CreateWebhook visible={visible} setVisible={setVisible} project={project} />
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

export default WebhookList;