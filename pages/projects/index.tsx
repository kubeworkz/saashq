import { CreateProject, Projects } from '@/components/project';
import { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from 'react-daisyui';
import type { NextPageWithLayout } from 'types';

const AllProjects: NextPageWithLayout = () => {
  const [visible, setVisible] = useState(false);

  const router = useRouter();
  const { t } = useTranslation('common');

  const { newProject } = router.query as { newProject: string };

  useEffect(() => {
    if (newProject) {
      setVisible(true);
    }
  }, [router.query]);
  
  return (
    <>
      <div className="flex items-center justify-between">
        <h4>{t('all-projects')}</h4>
        <Button
          color="primary"
          size="sm"
          variant="outline"          
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
