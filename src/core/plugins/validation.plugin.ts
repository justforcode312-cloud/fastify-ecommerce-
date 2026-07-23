import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import type { ZodType } from 'zod';

function validationPlugin(
  fastify: FastifyInstance,
  _options: unknown,
  done: (err?: Error) => void,
): void {
  const validate = (
    schemaOrSchemas: ZodType | { body?: ZodType; query?: ZodType; params?: ZodType },
    target: 'body' | 'query' | 'params' = 'body',
  ) => {
    return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
      if ('safeParse' in schemaOrSchemas || 'parse' in schemaOrSchemas) {
        const result = await (schemaOrSchemas as ZodType).parseAsync(request[target]);
        request[target] = result;
      } else {
        const schemas = schemaOrSchemas as { body?: ZodType; query?: ZodType; params?: ZodType };
        for (const [key, schema] of Object.entries(schemas)) {
          const t = key as 'body' | 'query' | 'params';
          if (schema) {
            const result = await schema.parseAsync(request[t]);
            request[t] = result;
          }
        }
      }
    };
  };

  fastify.decorate('validate', validate);
  done();
}

export default fp(validationPlugin, { name: 'validation' });
