import { AuditRepository } from './audit.repository';
import { AuditService } from './audit.service';

class AuditContainer {
  public readonly repository: AuditRepository;
  public readonly service: AuditService;

  constructor() {
    this.repository = new AuditRepository();
    this.service = new AuditService(this.repository);
  }
}

export const auditContainer = new AuditContainer();
