import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { Types } from 'mongoose';

import { auditContainer } from '@/modules/audit/audit.container';

async function auditPlugin(fastify: FastifyInstance) {
  fastify.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.audit) {
      return;
    }

    await auditContainer.service.log({
      user: request.user?.id ? new Types.ObjectId(request.user.id) : null,
      module: request.audit.module,
      action: request.audit.action,
      resource: request.audit.resourceId ?? '',
      oldValue: request.audit.oldValue,
      newValue: request.audit.newValue,
      method: request.method,
      endpoint: request.routeOptions?.url ?? request.url,
      ipAddress: request.ip,
      userAgent:
        typeof request.headers['user-agent'] === 'string'
          ? request.headers['user-agent']
          : undefined,
      statusCode: reply.statusCode,
    });
  });
}

export default fp(auditPlugin, {
  name: 'audit',
});
