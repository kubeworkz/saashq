import {
  InviteMember,
  PendingInvitations,
} from '@/components/invitation';
import { Members, ProjectTab } from '@/components/project';
import { Error, Loading } from '@/components/shared';
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
      <ProjectTab activeTab="members" project={project} />
      <div className="flex flex-col">
        <div className="flex mt-2 justify-end">
          <Button
            color="primary"
            onClick={() => {
              setVisible(!visible);
            }}
          >
            {t('add-member')}
          </Button>
        </div>
        <Members project={project} />
      </div>
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