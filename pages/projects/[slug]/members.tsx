import {
  InviteMember,
  PendingInvitations,
} from '@/components/interfaces/Invitation';
import { Members } from '@/components/interfaces/Project';
import { Error, Loading } from '@/components/ui';
import useProject from 'hooks/useProject';
import { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button } from 'react-daisyui';
import type { NextPageWithLayout } from 'types';

const ProjectMembers: NextPageWithLayout = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { slug } = router.query;

  const [visible, setVisible] = useState(false);

  const { isLoading, isError, project } = useProject(slug as string);

  if (isLoading || !project) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <div className="flex items-center justify-end">
        <Button
          color="primary"
          className="text-white"
          onClick={() => {
            setVisible(!visible);
          }}
        >
          {t('add-member')}
        </Button>
      </div>
      <Members project={project} />
      <PendingInvitations project={project} />
      <InviteMember visible={visible} setVisible={setVisible} project={project} />
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

export default ProjectMembers;