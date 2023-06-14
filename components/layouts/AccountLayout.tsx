import { Error, Loading, Navbar, Sidebar } from '@/components/ui';
import useProjects from 'hooks/useProjects';
import React from 'react';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isError, projects } = useProjects();

  if (isLoading || !projects) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Navbar> </Navbar>
      <div className="flex overflow-hidden pt-16 h-full">
        <Sidebar />
        <div className="relative h-full w-full overflow-y-auto lg:ml-64">
          <main>
            <div className="flex h-screen w-full justify-center">
              <div className="w-3/4 px-6 py-6 ">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
