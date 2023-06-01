import { CreateProject, Projects } from '@/components/interfaces/Project';
import { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { Button } from 'react-daisyui';
import type { NextPageWithLayout } from 'types';

const AllProjects: NextPageWithLayout = () => {
  const [visible, setVisible] = useState(false);

  const { t } = useTranslation('common');

  return (
    <>
      <div className="flex items-center justify-between">
        <h4>{t('all-projects')}</h4>
        <Button
          size="sm"
          color="primary"
          className="text-white"
          onClick={() => {
            setVisible(!visible);
          }}
        >
          {t('create-project')}
        </Button>
      </div>
      <CreateProject visible={visible} setVisible={setVisible} />
      <Projects />
    </>
  );
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default AllProjects;
