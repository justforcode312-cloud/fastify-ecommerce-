import type { FastifyReply, FastifyRequest } from 'fastify';

import { BaseController } from '@/core/base/base.controller';
import { ResponseUtils } from '@/core/utils/response.util';

import type { HealthService } from './health.service';

export class HealthController extends BaseController {
  constructor(private readonly healthService: HealthService) {
    super();
  }

  async check(_request: FastifyRequest, replay: FastifyReply): Promise<void> {
    const data = await this.healthService.check();
    const statusCode = data.status === 'UP' ? 200 : 503;

    return ResponseUtils.success(replay, data, 'Health check completed successfully', statusCode);
  }
}
