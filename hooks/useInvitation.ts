import fetcher from '@/lib/fetcher';
import { Invitation, Project } from '@prisma/client';
import useSWR from 'swr';
import { ApiResponse } from 'types';

const useInvitation = (token: string) => {
  const url = `/api/invitations/${token}`;

  const { data, error, isLoading } = useSWR<
    ApiResponse<Invitation & { project: Project }>
  >(token ? url : null, fetcher);

  return {
    isLoading,
    isError: error,
    invitation: data?.data,
  };
};

export default useInvitation;
