import { Card } from '@/components/shared';
import { Error, Loading } from '@/components/shared';
import { ProjectTab } from '@/components/project';
import env from '@/lib/env';
import { inferSSRProps } from '@/lib/inferSSRProps';
import { getViewerToken } from '@/lib/retraced';
import { getSession } from '@/lib/session';
import useCanAccess from 'hooks/useCanAccess';
import useProject from 'hooks/useProject';
import { getProjectMember } from 'models/project';
import { throwIfNotAllowed } from 'models/user';
import { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
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
  error,
}) => {
  const router = useRouter();
  const { slug } = router.query;
  const { t } = useTranslation('common');
  const { canAccess } = useCanAccess();

  const { isLoading, isError, project } = useProject(slug as string);

  if (isLoading) {
    return <Loading />;
  }

  if (isError || error) {
    return <Error message={isError?.message || error?.message} />;
  }

  if (!project) {
    return <Error message="Project not found" />;
  }

  return (
    <>
      <ProjectTab activeTab="audit-logs" project={project} />
      <Card heading={t('audit-logs')}>
        <Card.Body>
          {canAccess('project_audit_log', ['read']) && auditLogToken && (
            <RetracedEventsBrowser
              host={`${retracedHost}/viewer/v1`}
              auditLogToken={auditLogToken}
              header={t('audit-logs')}
            />
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { locale, req, res, query } = context;

  const session = await getSession(req, res);
  const projectMember = await getProjectMember(
    session?.user.id as string,
    query.slug as string
  );

  try {
    throwIfNotAllowed(projectMember, 'project_audit_log', 'read');

    const auditLogToken = await getViewerToken(
      projectMember.project.id,
      session?.user.id as string
    );

    return {
      props: {
        ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
        error: null,
        auditLogToken,
        retracedHost: env.retraced.url,
      },
    };
  } catch (error: any) {
    return {
      props: {
        ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
        error: {
          message: error.message,
        },
        auditLogToken: null,
        retracedHost: null,
      },
    };
  }
}

export default Events;