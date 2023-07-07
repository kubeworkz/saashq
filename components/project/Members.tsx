import { Card, Error, LetterAvatar, Loading } from '@/components/shared';
import { isProjectAdmin } from '@/lib/projects';
import { Project, ProjectMember } from '@prisma/client';
import axios from 'axios';
import useProjectMembers from 'hooks/useProjectMembers';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';

import UpdateMemberRole from './UpdateMemberRole';

const Members = ({ project }: { project: Project }) => {
  const { data: session } = useSession();
  const { t } = useTranslation('common');

  const { isLoading, isError, members, mutateProjectMembers } = useProjectMembers(
    project.slug
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !session) {
    return <Error />;
  }

  if (!members) {
    return null;
  }

  const removeProjectMember = async (member: ProjectMember) => {
    const sp = new URLSearchParams({ memberId: member.userId });

    await axios.delete(`/api/projects/${project.slug}/members?${sp.toString()}`);

    mutateProjectMembers();

    toast.success(t('member-deleted'));
  };

  const isAdmin = isProjectAdmin(session.user, members);

  const canUpdateRole = (member: ProjectMember) => {
    return session.user.id != member.userId && isAdmin;
  };

  const canRemoveMember = (member: ProjectMember) => {
    return session.user.id != member.userId && isAdmin;
  };

  return (
    <Card heading={t('project-members')}>
      <Card.Body>
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                {t('name')}
              </th>
              <th scope="col" className="px-6 py-3">
                {t('email')}
              </th>
              <th scope="col" className="px-6 py-3">
                {t('role')}
              </th>
              {isAdmin && (
                <th scope="col" className="px-6 py-3">
                  {t('action')}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              return (
                <tr
                  key={member.id}
                  className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-start space-x-2">
                      <LetterAvatar name={member.user.name} />
                      <span>{member.user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">{member.user.email}</td>
                  <td className="px-6 py-3">
                    {canUpdateRole(member) ? (
                      <UpdateMemberRole project={project} member={member} />
                    ) : (
                      <span>{member.role}</span>
                    )}
                  </td>
                  {canRemoveMember(member) && (
                    <td className="px-6 py-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          removeProjectMember(member);
                        }}
                      >
                        {t('remove')}
                      </Button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card.Body>
    </Card>
  );
};

export default Members;