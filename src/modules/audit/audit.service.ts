import type { AuditRepository } from '@/modules/audit/audit.repository';

import type { AuditModules } from './audit.constants';
import type { Audit } from './audit.model';
import type { CreateAuditType } from './audit.type';

export class AuditService {
  constructor(private readonly auditRepository: AuditRepository) {}

  async log(data: CreateAuditType) {
    const user = data.user === undefined ? null : data.user;
    return this.auditRepository.create({
      user: user,
      module: data.module,
      action: data.action,
      resource: data.resource ?? null,
      method: data.method,
      endpoint: data.endpoint,
      ipAddress: data.ipAddress ?? null,
      userAgent: data.userAgent ?? null,
      oldValue: data.oldValue ?? null,
      newValue: data.newValue ?? null,
      statusCode: data.statusCode,
    });
  }

  async findByUser(userId: string): Promise<Audit[] | null> {
    return this.auditRepository.findByUser(userId);
  }

  async findByModule(module: AuditModules): Promise<Audit[]> {
    return this.auditRepository.findByModule(module);
  }

  async findByResource(resource: string): Promise<Audit[] | null> {
    return this.auditRepository.findByResource(resource);
  }
}
