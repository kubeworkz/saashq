import { ConfigureSAML } from '@/components/interfaces/SAML';
import { Error, Loading } from '@/components/ui';
import { Card } from '@/components/ui';
import useSAMLConfig from 'hooks/useSAMLConfig';
import useProject from 'hooks/useProject';
import { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button } from 'react-daisyui';
import type { NextPageWithLayout } from 'types';

const ProjectSSO: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { slug } = router.query as { slug: string };

  const [visible, setVisible] = useState(false);
  const { isLoading, isError, project } = useProject(slug);
  const { samlConfig } = useSAMLConfig(slug);

  if (isLoading || !project) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  const connectionExists = samlConfig && 'idpMetadata' in samlConfig.config;

  return (
    <>
      <Card heading="SAML Single Sign-On">
        <Card.Body className="px-3 py-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm">{t('allow-team')}</p>
            <Button
              size="sm"
              onClick={() => setVisible(!visible)}
              variant="outline"
              color="secondary"
            >
              {t('configure')}
            </Button>
          </div>
          {connectionExists && (
            <div className="flex flex-col justify-between space-y-2 border-t text-sm">
              <p className="mt-3 text-sm">{t('identity-provider')}</p>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">{t('entity-id')}</span>
                </label>
                <input
                  type="text"
                  className="input-bordered input w-full"
                  defaultValue={samlConfig.issuer}
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">ACS URL</span>
                </label>
                <input
                  type="text"
                  className="input-bordered input w-full"
                  defaultValue={samlConfig.acs}
                />
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
      <ConfigureSAML project={project} visible={visible} setVisible={setVisible} />
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

export default ProjectSSO;