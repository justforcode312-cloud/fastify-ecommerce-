import { type Types } from 'mongoose';

import { type AuditActions, type AuditModules } from '@/modules/audit/audit.constants';

export interface CreateAuditType {
  user?: Types.ObjectId | null;
  module: AuditModules;
  action: AuditActions;
  resource: string;
  method: string;
  endpoint: string;
  ipAddress?: string;
  userAgent?: string;
  oldValue?: unknown;
  newValue?: unknown;
  statusCode: number;
}

export interface AuditContext {
  module: AuditModules;
  action: AuditActions;
  resourceId?: string;
  oldValue?: unknown;
  newValue?: unknown;
}
