import { Card } from '@/components/shared';
import { Project } from '@prisma/client';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';

const RemoveProject = ({ project }: { project: Project }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [loading, setLoading] = React.useState(false);

  const removeProject = async () => {
    const confirm = window.confirm(
      'Are you sure you want to remove this project and project database? This action cannot be undone.'
    );

    if (!confirm) return;

    setLoading(true);

    const response = await axios.delete(`/api/projects/${project.slug}`);

    setLoading(false);

    const { data, error } = response.data;

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data) {
      toast.success('Project removed successfully!');
      return router.push('/projects');
    }
  };

  return (
    <Card heading="Remove Project">
      <Card.Body className="px-3 py-3">
        <div className="space-y-3">
          <p className="text-sm">{t('remove-project-warning')}</p>
          <Button
            color="error"
            onClick={removeProject}
            loading={loading}
          >
            {t('remove-project')}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RemoveProject;
