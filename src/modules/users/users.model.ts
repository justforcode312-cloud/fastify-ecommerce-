import mongoose, { type Document, type HydratedDocument, type Model, Schema } from 'mongoose';

import { baseSchemaOptions } from '@/core/config/schema-options.config';
import { USER_ROLE, USER_STATUS } from '@/core/enums/user.enums';

export interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: USER_ROLE;
  status: USER_STATUS;
  isEmailVerified: boolean;
  lastLoginAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const UsersSchema = new Schema<User>(
  {
    firstName: { type: String, required: true, trim: true, maxLength: 50 },
    lastName: { type: String, required: true, trim: true, maxLength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.CUSTOMER,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACCEPTED,
      index: true,
    },

    isEmailVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date, default: null },
  },
  baseSchemaOptions,
);

export type UserDocument = HydratedDocument<User>;

export const UserModel: Model<User> = mongoose.model<User>('Users', UsersSchema, 'users');
