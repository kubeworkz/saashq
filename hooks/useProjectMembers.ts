import fetcher from '@/lib/fetcher';
import type { ProjectMember, User } from '@prisma/client';
import useSWR, { mutate } from 'swr';
import type { ApiResponse } from 'types';

type ProjectMemberWithUser = ProjectMember & { user: User };

const useProjectMembers = (slug: string) => {
  const url = `/api/projects/${slug}/members`;

  const { data, error, isLoading } = useSWR<ApiResponse<ProjectMemberWithUser[]>>(
    url,
    fetcher
  );

  const mutateProjectMembers = async () => {
    mutate(url);
  };

  return {
    isLoading,
    isError: error,
    members: data?.data,
    mutateProjectMembers,
  };
};

export default useProjectMembers;
