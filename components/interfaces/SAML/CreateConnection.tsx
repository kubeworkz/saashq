import { InputWithLabel } from '@/components/ui';
import { getAxiosError } from '@/lib/common';
import type { SAMLSSORecord } from '@boxyhq/saml-jackson';
import { Project } from '@prisma/client';
import axios from 'axios';
import { useFormik } from 'formik';
import useSAMLConfig from 'hooks/useSAMLConfig';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button, Modal, Tabs, Textarea } from 'react-daisyui';
import toast from 'react-hot-toast';
import type { ApiResponse } from 'types';
import * as Yup from 'yup';

interface CreateConnectionProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  project: Project;
}

const CreateConnection = (props: CreateConnectionProps) => {
  const { visible, setVisible, project } = props;

  const { mutateSamlConfig } = useSAMLConfig(project.slug);
  const { t } = useTranslation('common');
  const [tab, setTab] = useState(0);

  const initialValues = {
    metadataUrl: '',
    metadataRaw: '',
  };

  const validationSchema = Yup.object().shape({
    metadataUrl: Yup.string()
      .url()
      .when('tab', {
        is: tab === 0,
        then: Yup.string().required(),
      }),
    metadataRaw: Yup.string().when('tab', {
      is: tab === 1,
      then: Yup.string().required(),
    }),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const { metadataUrl, metadataRaw } = values;

      try {
        const response = await axios.post<ApiResponse<SAMLSSORecord>>(
          `/api/projects/${project.slug}/saml`,
          {
            metadataUrl,
            encodedRawMetadata: metadataRaw
              ? Buffer.from(metadataRaw).toString('base64')
              : undefined,
          }
        );

        const { data } = response.data;

        if (data) {
          toast.success(t('saml-config-updated'));
          mutateSamlConfig();
          setVisible(false);
        }
      } catch (error: any) {
        toast.error(getAxiosError(error));
      }
    },
  });

  return (
    <Modal open={visible}>
      <form onSubmit={formik.handleSubmit} method="POST">
        <Modal.Header className="font-bold">
          {t('configure-singlesignon')}
        </Modal.Header>
        <Modal.Body>
          <div className="mt-4 flex flex-col space-y-4">
            <Tabs variant="bordered" size="md" value={tab} onChange={setTab}>
              <Tabs.Tab value={0}>{t('metadata-url')}</Tabs.Tab>
              <Tabs.Tab value={1}>{t('metadata-xml')}</Tabs.Tab>
            </Tabs>

            {tab === 0 && (
              <div className="flex">
                <InputWithLabel
                  label={t('metadata-url')}
                  name="metadataUrl"
                  onChange={formik.handleChange}
                  value={formik.values.metadataUrl}
                  required={true}
                  error={formik.errors.metadataUrl}
                />
              </div>
            )}

            {tab === 1 && (
              <div className="flex">
                <Textarea
                  name="metadataRaw"
                  className="flex-grow"
                  onChange={formik.handleChange}
                  value={formik.values.metadataRaw}
                  rows={6}
                  placeholder={t('copy-paste-metadata')}
                  required
                />
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Actions>
          <Button
            type="submit"
            color="primary"
            loading={formik.isSubmitting}
            active={formik.dirty}
          >
            {t('save-changes')}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setVisible(!visible);
            }}
          >
            {t('close')}
          </Button>
        </Modal.Actions>
      </form>
    </Modal>
  );
};

export default CreateConnection;