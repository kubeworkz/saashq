import type { Project } from '@prisma/client';
import { Client } from '@retracedhq/retraced';
import type { CRUD, Event } from '@retracedhq/retraced';
import type { User } from 'next-auth';

import env from './env';

export type EventType =
  | 'member.invitation.create'
  | 'member.invitation.delete'
  | 'member.remove'
  | 'member.update'
  | 'sso.connection.create'
  | 'sso.connection.delete'
  | 'dsync.connection.create'
  | 'webhook.create'
  | 'webhook.delete'
  | 'webhook.update'
  | 'project.create'
  | 'project.update'
  | 'project.delete';

type Request = {
  action: EventType;
  user: User;
  project: Project;
  crud: CRUD;
  // target: Target;
};

let retracedClient: Client;

const getRetracedClient = () => {
  if (!env.retraced.apiKey || !env.retraced.projectId || !env.retraced.url) {
    return;
  }

  if (!retracedClient) {
    retracedClient = new Client({
      endpoint: env.retraced.url,
      apiKey: env.retraced.apiKey,
      projectId: env.retraced.projectId,
    });
  }

  return retracedClient;
};

export const sendAudit = async (request: Request) => {
  const retracedClient = getRetracedClient();

  if (!retracedClient) {
    return;
  }

  const { action, user, project, crud } = request;

  const event: Event = {
    action,
    crud,
    group: {
      id: project.id,
      name: project.name,
    },
    actor: {
      id: user.id,
      name: user.name as string,
    },
    created: new Date(),
  };

  return await retracedClient.reportEvent(event);
};

export const getViewerToken = async (groupId: string, actorId: string) => {
  const retracedClient = getRetracedClient();

  if (!retracedClient) {
    return;
  }

  try {
    return await retracedClient.getViewerToken(groupId, actorId, true);
  } catch (error: any) {
    throw new Error(
      'Unable to get viewer token from Retraced. Please check Retraced configuration.'
    );
  }
};
