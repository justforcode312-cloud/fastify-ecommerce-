import { HealthController } from './health.controller';
import { HealthService } from './health.service';

class HealthContainer {
  public readonly healthService: HealthService;
  public readonly healthController: HealthController;

  constructor() {
    this.healthService = new HealthService();
    this.healthController = new HealthController(this.healthService);
  }
}

export const healthContainer = new HealthContainer();
