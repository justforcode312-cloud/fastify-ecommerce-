import {
  type Document,
  type HydratedDocument,
  type Model,
  model,
  Schema,
  type Types,
} from 'mongoose';

import { baseSchemaOptions } from '@/core/config/schema-options.config';

export interface RefreshToken extends Document {
  user: Types.ObjectId;
  tokenHash: string;
  jti: string;
  expiresAt: Date;
  isRevoked: boolean;
  device: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const RefreshTokenSchema = new Schema<RefreshToken>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true },
    jti: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, expires: 0 },
    isRevoked: { type: Boolean, default: false, index: true },
    device: { type: String, default: null },
    ipAddress: { type: String, default: null },
    userAgent: { type: String, default: null },
  },
  baseSchemaOptions,
);

RefreshTokenSchema.index({ user: 1, isRevoked: 1, jti: 1 });

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

export const RefreshTokenModel: Model<RefreshToken> = model<RefreshToken>(
  'RefreshToken',
  RefreshTokenSchema,
  'refreshToken',
);
