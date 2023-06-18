import { ProjectTab } from '@/components/project';
import { Card } from '@/components/shared';
import { Error, Loading } from '@/components/shared';
import env from '@/lib/env';
import { inferSSRProps } from '@/lib/inferSSRProps';
import { getViewerToken } from '@/lib/retraced';
import { getSession } from '@/lib/session';
import useProject from 'hooks/useProject';
import { getProject, isProjectAdmin } from 'models/project';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import type { NextPageWithLayout } from 'types';

interface RetracedEventsBrowserProps {
  host: string;
  auditLogToken: string;
  header: string;
}

const RetracedEventsBrowser = dynamic<RetracedEventsBrowserProps>(
  () => import('@retracedhq/logs-viewer'),
  {
    ssr: false,
  }
);

const Events: NextPageWithLayout<inferSSRProps<typeof getServerSideProps>> = ({
  auditLogToken,
  retracedHost,
}) => {
  const router = useRouter();
  const { slug } = router.query;
  
  const { isLoading, isError, project } = useProject(slug as string);

  if (isLoading || !project) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  if (!auditLogToken) {
    return (
      <Error message="Error getting audit log token. Please check your configuration." />
    );
  }

  return (
    <>
      <ProjectTab activeTab="audit-logs" project={project} />
      <Card heading="Audit Logs">
        <Card.Body>
          <RetracedEventsBrowser
            host={`${retracedHost}/viewer/v1`}
            auditLogToken={auditLogToken}
            header="Audit Logs"
          />
        </Card.Body>
      </Card>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { locale, req, res, query } = context;

  const session = await getSession(req, res);

  if (!session?.user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const { slug } = query as { slug: string };

  const project = await getProject({ slug });

  if (!(await isProjectAdmin(session.user.id, project.id))) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
      auditLogToken: await getViewerToken(project.id, session.user.id),
      retracedHost: env.retraced.url,
    },
  };
}

export default Events;