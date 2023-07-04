import { Card } from '@/components/shared';
import { Project } from '@prisma/client';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';

import ConfirmationDialog from '../shared/ConfirmationDialog';

const RemoveProject = ({ project }: { project: Project }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(false);
  const [askConfirmation, setAskConfirmation] = useState(false);

  const removeProject = async () => {
    setLoading(true);

    const response = await axios.delete(`/api/projects/${project.slug}`);

    setLoading(false);

    const { data, error } = response.data;

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data) {
      toast.success(t('project-removed-successfully'));
      return router.push('/projects');
    }
  };

  return (
    <>
      <Card heading={t('remove-project')}>
        <Card.Body className="px-3 py-3">
          <div className="flex flex-row gap-4">
            <p className="text-sm">{t('remove-project-warning')}</p>
            <Button
              color="error"
              onClick={() => setAskConfirmation(true)}
              loading={loading}
              variant="outline"
              size="sm"
            >
              {t('remove-project')}
            </Button>
          </div>
        </Card.Body>
      </Card>
      <ConfirmationDialog
        visible={askConfirmation}
        title={t('remove-project')}
        onCancel={() => setAskConfirmation(false)}
        onConfirm={removeProject}
      >
        {t('remove-project-confirmation')}
      </ConfirmationDialog>
    </>
  );
};

export default RemoveProject;