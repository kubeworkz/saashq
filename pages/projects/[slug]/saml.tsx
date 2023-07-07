import { CreateConnection } from '@/components/saml';
import { Alert, Error, InputWithLabel, Loading } from '@/components/shared';
import { Card } from '@/components/shared';
import ConfirmationDialog from '@/components/shared/ConfirmationDialog';
import { ProjectTab } from '@/components/project';
import type { SAMLSSORecord } from '@boxyhq/saml-jackson';
import useSAMLConfig from 'hooks/useSAMLConfig';
import useProject from 'hooks/useProject';
import { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button } from 'react-daisyui';
import { toast } from 'react-hot-toast';
import type { ApiResponse, NextPageWithLayout } from 'types';

const ProjectSSO: NextPageWithLayout = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [visible, setVisible] = useState(false);
  const [selectedSsoConnection, setSelectedSsoConnection] =
    useState<SAMLSSORecord | null>(null);
  const [confirmationDialogVisible, setConfirmationDialogVisible] =
    useState(false);

  const { slug } = router.query as { slug: string };

  const { isLoading, isError, project } = useProject(slug);
  const { samlConfig, mutateSamlConfig } = useSAMLConfig(slug);
  // Delete SSO Connection
  const deleteSsoConnection = async (connection: SAMLSSORecord | null) => {
    if (!connection) return;
    const { clientID, clientSecret } = connection;
    const params = new URLSearchParams({
      clientID,
      clientSecret,
    });
    const res = await fetch(`/api/projects/${slug}/saml?${params}`, {
      method: 'DELETE',
    });

    const { data, error } = (await res.json()) as ApiResponse<null>;

    setSelectedSsoConnection(null);
    setConfirmationDialogVisible(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data) {
      mutateSamlConfig();
      toast.success('SSO Connection deleted successfully');
    }
  };

  if (isLoading || !project) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  const connectionsAdded =
    samlConfig?.connections && samlConfig.connections.length > 0;

  return (
    <>
      <ProjectTab activeTab="saml" project={project} />
      {connectionsAdded && (
        <div className="flex flex-col">
          <div className="flex mt-2 justify-end">
            <Button
              color="primary"
              onClick={() => {
                setVisible(!visible);
              }}
            >
              {t('add-connection')}
            </Button>
          </div>

          <Card heading={t('project-connections')}>
            <Card.Body>
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    {/* <th scope="col" className="px-6 py-3">
                    {t('name')}
                  </th> */}
                    <th scope="col" className="px-6 py-3">
                      {t('provider')}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {t('actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {connectionsAdded &&
                    samlConfig?.connections.map((connection) => {
                      return (
                        <tr
                          key={connection.clientID}
                          className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                        >
                          <td className="px-6 py-3">
                            {connection.idpMetadata.friendlyProviderName ||
                              connection.idpMetadata.provider}
                          </td>
                          <td className="px-6 py-3">
                            <Button
                              size="xs"
                              color="error"
                              variant="outline"
                              onClick={() => {
                                setSelectedSsoConnection(connection);
                                setConfirmationDialogVisible(true);
                              }}
                            >
                              Delete
                            </Button>
                          </td>
                          {/* <td className="px-6 py-3">{connection.product}</td> */}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </div>
      )}
      <Card heading={t('configure-singlesignon')}>
        <Card.Body className="px-3 py-3 text-sm">
          {!connectionsAdded && (
            <div className="mb-3 flex items-center justify-between">
              <p>{t('allow-project')}</p>
              <Button
                onClick={() => setVisible(!visible)}
                variant="outline"
                size="sm"
                color="primary"
              >
                {t('configure')}
              </Button>
            </div>
          )}
          {connectionsAdded && (
            <>
              <Alert status="success">{t('saml-connection-established')}</Alert>
              <div className="flex flex-col justify-between space-y-2 mt-4">
                <p>{t('identity-provider')}</p>
                <InputWithLabel
                  label={t('entity-id')}
                  defaultValue={samlConfig.issuer}
                  className="w-full text-sm"
                />
                <InputWithLabel
                  label={t('acs-url')}
                  defaultValue={samlConfig.acs}
                  className="w-full text-sm"
                />
              </div>
            </>
          )}
        </Card.Body>
      </Card>
      <CreateConnection project={project} visible={visible} setVisible={setVisible} />
      <ConfirmationDialog
        title="Delete SSO Connection"
        visible={confirmationDialogVisible}
        onConfirm={() => deleteSsoConnection(selectedSsoConnection)}
        onCancel={() => setConfirmationDialogVisible(false)}
        cancelText="Cancel"
        confirmText="Delete SSO Connection"
      >
        Are you sure you want to delete this SSO Connection? This action can not
        be undone.
      </ConfirmationDialog>
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