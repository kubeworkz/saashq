import { availableRoles } from '@/lib/roles';
import { Project, ProjectMember } from '@prisma/client';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import toast from 'react-hot-toast';

interface UpdateMemberRoleProps {
  project: Project;
  member: ProjectMember;
}

const UpdateMemberRole = ({ project, member }: UpdateMemberRoleProps) => {
  const { t } = useTranslation('common');

  const updateRole = async (member: ProjectMember, role: string) => {
    await axios.patch(`/api/projects/${project.slug}/members`, {
      memberId: member.userId,
      role,
    });

    toast.success(t('member-role-updated'));
  };

  return (
    <select
      className="rounded-md text-sm"
      onChange={(e) => updateRole(member, e.target.value)}
    >
      {availableRoles.map((role) => (
        <option value={role.id} key={role.id} selected={role.id == member.role}>
          {role.id}
        </option>
      ))}
    </select>
  );
};

export default UpdateMemberRole;