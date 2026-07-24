import { BaseRepository } from '@/core/base/base.repository';

import { type AuditModules } from './audit.constants';
import { type Audit, AuditModel } from './audit.model';

export class AuditRepository extends BaseRepository<Audit> {
  constructor() {
    super(AuditModel);
  }
  async findByUser(userId: string): Promise<Audit[]> {
    return this.find({ user: userId });
  }

  async findByModule(module: AuditModules): Promise<Audit[]> {
    return this.find({ module });
  }

  async findByResource(resource: string): Promise<Audit[]> {
    return this.find({ resource });
  }
}
