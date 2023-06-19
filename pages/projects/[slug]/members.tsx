import RemoveDatabase from '@/components/database/RemoveDatabase';
import {
  InviteMember,
  PendingInvitations,
} from '@/components/invitation';
import { Members, ProjectTab } from '@/components/project';
import { Error, Loading } from '@/components/shared';
import { getAxiosError } from '@/lib/common';
import axios from 'axios';
import useProject from 'hooks/useProject';
import { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import type { NextPageWithLayout } from 'types';

const ProjectMembers: NextPageWithLayout = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { t } = useTranslation('common');

  const [visible, setVisible] = useState(false);
  const [VisibleDatabase, setVisibleDatabase] = useState(false);

  const { isLoading, isError, project } = useProject(slug as string);

  const [value, setValue] = useState<any>(null); // Set initial value to null or any other appropriate value

  useEffect(() => {
    if (project?.connectionString) {
      setValue(project.connectionString);
    }
  }, [project]);

  let existingproject;
  if (isLoading || !project) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  const HandleCreateDatabase = async (id: string) => {
    try {
      existingproject = await axios.post(
        `/api/database/create`, {
          data: id
        }
      );
      setValue(existingproject?.data?.data?.connectionString);
      toast.success(t('create-database-success'));
      setVisible(false);
    } catch (error: any) {
      toast.error(getAxiosError(error));
    }
  }

  return (
    <>
      <h3 className="text-2xl font-bold">{project.name}</h3>
      <ProjectTab project={project} activeTab="members" />
      <div className="flex items-center justify-end">
        {/* ternary operator to conditionary rendered create and remove button */}
      {!value ? 
      <Button
          size="sm"
          color="primary"
          className="text-white mr-2"
          onClick={
            () => HandleCreateDatabase(project.id)
          }
        >
          {console.log(t('create-database'))}
          {t('create-database')}
      </Button> :
      <Button
          size="sm"
          color="primary"
          className="text-white mr-2"
          onClick={() => {
            setVisibleDatabase(!VisibleDatabase);
          }}
        >
          {t('remove-database')}
      </Button>}

        <Button
          size="sm"
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
      <RemoveDatabase visible={VisibleDatabase} setVisible={setVisibleDatabase}  project={project} value={setValue} />
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
