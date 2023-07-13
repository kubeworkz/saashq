import fetcher from '@/lib/fetcher';
import type { Permission } from '@/lib/permissions';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import type { ApiResponse } from 'types';

const usePermissions = () => {
  const router = useRouter();
  const [projectSlug, setProjectSlug] = useState<string | null>(null);

  const { slug } = router.query as { slug: string };

  useEffect(() => {
    if (slug) {
      setProjectSlug(slug);
    }
  }, [router.query]);

  const { data, error, isLoading } = useSWR<ApiResponse<Permission[]>>(
    projectSlug ? `/api/projects/${projectSlug}/permissions` : null,
    fetcher
  );

  return {
    isLoading,
    isError: error,
    permissions: data?.data,
  };
};

export default usePermissions;
