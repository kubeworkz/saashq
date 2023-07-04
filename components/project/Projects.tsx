import { Card, Error, LetterAvatar, Loading } from '@/components/shared';
import { getAxiosError } from '@/lib/common';
import { Project } from '@prisma/client';
import axios from 'axios';
import useProjects from 'hooks/useProjects';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import { ApiResponse } from 'types';

import ConfirmationDialog from '../shared/ConfirmationDialog';

const Projects = () => {
  const { t } = useTranslation('common');
  const [project, setProject] = useState<Project | null>(null);
  const { isLoading, isError, projects, mutateProjects } = useProjects();
  const [askConfirmation, setAskConfirmation] = useState(false);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  const leaveProject = async (project: Project) => {
    try {
      await axios.put<ApiResponse>(`/api/projects/${project.slug}/members`);
      toast.success(t('leave-project-success'));
      mutateProjects();
    } catch (error: any) {
      toast.error(getAxiosError(error));
    }
  };

  return (
    <>
      <Card heading={t('all-projects')}>
        <Card.Body>
          <table className="w-full table-fixed text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  {t('name')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('members')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('created-at')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {projects &&
                projects.map((project) => {
                  return (
                    <tr
                      key={project.id}
                      className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-3">
                        <Link href={`/projects/${project.slug}/members`}>
                          <div className="flex items-center justify-start space-x-2">
                            <LetterAvatar name={project.name} />
                            <span className="underline">{project.name}</span>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-3">{project._count.members}</td>
                      <td className="px-6 py-3">
                        {new Date(project.createdAt).toDateString()}
                      </td>
                      <td className="px-6 py-3">
                        <Button
                          variant="outline"
                          size="sm"
                          color="error"
                          onClick={() => {
                            setProject(project);
                            setAskConfirmation(true);
                          }}
                        >
                          {t('leave-project')}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </Card.Body>
      </Card>
      <ConfirmationDialog
        visible={askConfirmation}
        title={`${t('leave-project')} ${project?.name}`}
        onCancel={() => setAskConfirmation(false)}
        onConfirm={() => {
          if (project) {
            leaveProject(project);
          }
        }}
        confirmText={t('leave-project')}
      >
        {t('leave-project-confirmation')}
      </ConfirmationDialog>
    </>
  );
};

export default Projects;