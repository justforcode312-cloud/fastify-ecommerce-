import {
  type Document,
  type HydratedDocument,
  type Model,
  model,
  Schema,
  type Types,
} from 'mongoose';

import { baseSchemaOptions } from '@/core/config/schema-options.config';

import { AuditActions, AuditModules } from './audit.constants';

export interface Audit extends Document {
  user: Types.ObjectId | null;
  module: AuditModules;
  action: AuditActions;
  resource: Types.ObjectId | null;
  method: string;
  endpoint: string;
  ipAddress: string | null;
  userAgent: string | null;
  oldValue: unknown | null;
  newValue: unknown | null;
  status: number;
}

const AuditSchema = new Schema<Audit>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'user', default: null },
    module: { type: String, enum: Object.values(AuditModules), required: true },
    action: { type: String, enum: Object.values(AuditActions), required: true },
    resource: { type: String, default: null },
    method: { type: String, required: true },
    endpoint: { type: String, required: true },
    ipAddress: { type: String, default: null },
    userAgent: { type: String, default: null },
    oldValue: { type: Schema.Types.Mixed, default: null },
    newValue: { type: Schema.Types.Mixed, default: null },
  },
  baseSchemaOptions,
);

export type AuditDocument = HydratedDocument<Audit>;
export const AuditModel: Model<Audit> = model<Audit>('Audit', AuditSchema, 'audit');
