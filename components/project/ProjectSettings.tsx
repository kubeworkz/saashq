import { Card, InputWithLabel } from '@/components/shared';
import { getAxiosError } from '@/lib/common';
import { Project } from '@prisma/client';
import axios from 'axios';
import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import type { ApiResponse } from 'types';
import * as Yup from 'yup';
import { SwitchTheme } from '@/components/shared';

const ProjectSettings = ({ project }: { project: Project }) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const formik = useFormik({
    initialValues: {
      name: project.name,
      slug: project.slug,
      domain: project.domain,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Name is required'),
      slug: Yup.string().required('Slug is required'),
      domain: Yup.string().nullable(),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const response = await axios.put<ApiResponse<Project>>(
          `/api/projects/${project.slug}`,
          {
            ...values,
          }
        );

        const { data: projectUpdated } = response.data;

        if (projectUpdated) {
          toast.success(t('successfully-updated'));
          return router.push(`/projects/${projectUpdated.slug}/settings`);
        }
      } catch (error: any) {
        toast.error(getAxiosError(error));
      }
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Card heading={t('project-settings')}>
          <Card.Body className="px-3 py-3">
            <div className="flex flex-col">
              <InputWithLabel
                name="name"
                label={t('project-name')}
                descriptionText={t('project-name')}
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.errors.name}
              />
              <InputWithLabel
                name="slug"
                label={t('project-slug')}
                descriptionText={t('project-slug-description')}
                value={formik.values.slug}
                onChange={formik.handleChange}
                error={formik.errors.slug}
              />
              <InputWithLabel
                name="domain"
                label={t('project-domain')}
                descriptionText={t('project-domain')}
                value={formik.values.domain ? formik.values.domain : ''}
                onChange={formik.handleChange}
                error={formik.errors.domain}
              />
            </div>
          </Card.Body>
          <Card.Footer>
            <div className="flex justify-end">
              <Button
                type="submit"
                color="primary"
                loading={formik.isSubmitting}
                disabled={!formik.isValid || !formik.dirty}
              >
                {t('save-changes')}
              </Button>
            </div>
          </Card.Footer>
        </Card>
      </form>
    </>
  );
};

export default ProjectSettings;
