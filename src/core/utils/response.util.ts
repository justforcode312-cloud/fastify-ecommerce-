import type { FastifyReply } from 'fastify';

export const ResponseUtils = {
  /**
   * Send a standard success response (200 OK by default)
   */
  async success<T>(
    reply: FastifyReply,
    data: T,
    message = 'Success',
    statusCode = 200,
  ): Promise<void> {
    await reply.status(statusCode).send({
      success: true,
      statusCode,
      message,
      data,
    });
  },

  /**
   * Send a standard paginated success response
   */
  async paginate<T>(
    reply: FastifyReply,
    data: T[],
    pagination: { page: number; limit: number; totalItems: number },
    message = 'Success',
    statusCode = 200,
  ): Promise<void> {
    const { page, limit, totalItems } = pagination;
    const totalPages = limit > 0 ? Math.ceil(totalItems / limit) : 0;

    await reply.status(statusCode).send({
      success: true,
      statusCode,
      message,
      data,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    });
  },
};
