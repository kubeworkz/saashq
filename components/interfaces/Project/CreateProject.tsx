import { getAxiosError } from '@/lib/common';
import type { Project } from '@prisma/client';
import axios from 'axios';
import { useFormik } from 'formik';
import useProjects from 'hooks/useProjects';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { Button, Input, Modal } from 'react-daisyui';
import toast from 'react-hot-toast';
import type { ApiResponse } from 'types';
import * as Yup from 'yup';

const CreateProject = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) => {
  const { t } = useTranslation('common');
  const { mutateProjects } = useProjects();

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post<ApiResponse<Project>>('/api/projects/', {
          ...values,
        });

        const { data: projectCreated } = response.data;

        if (projectCreated) {
          toast.success(t('project-created'));
          mutateProjects();
          formik.resetForm();
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
        <Modal.Header className="font-bold">Create Project</Modal.Header>
        <Modal.Body>
          <div className="mt-2 flex flex-col space-y-4">
            <p>{t('members-of-a-project')}</p>
            <div className="flex justify-between space-x-3">
              <Input
                name="name"
                className="flex-grow"
                onChange={formik.handleChange}
                value={formik.values.name}
                placeholder="Project name"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Actions>
          <Button
            type="submit"
            color="primary"
            loading={formik.isSubmitting}
            active={formik.dirty}
          >
            {t('create-project')}
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

export default CreateProject;
