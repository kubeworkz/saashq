import { Card, InputWithLabel } from '@/components/ui';
import { getAxiosError } from '@/lib/common';
import { Project } from '@prisma/client';
import axios from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import type { ApiResponse } from 'types';
import * as Yup from 'yup';

const ProjectSettings = ({ project }: { project: Project }) => {
  const router = useRouter();

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
          toast.success('Successfully updated!');
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
        <Card heading="Project Settings">
          <Card.Body className="px-3 py-3">
            <div className="flex flex-col">
              <InputWithLabel
                name="name"
                label="Display name"
                descriptionText="A human-friendly name for the project"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.errors.name}
              />
              <InputWithLabel
                name="slug"
                label="Project slug"
                descriptionText="A unique ID used to identify this project"
                value={formik.values.slug}
                onChange={formik.handleChange}
                error={formik.errors.slug}
              />
              <InputWithLabel
                name="domain"
                label="Domain"
                descriptionText="Domain name for the project"
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
                className="text-white"
                size="sm"
              >
                Save Changes
              </Button>
            </div>
          </Card.Footer>
        </Card>
      </form>
    </>
  );
};

export default ProjectSettings;
