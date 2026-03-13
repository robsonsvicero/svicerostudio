import mongoose from 'mongoose';
import { baseSchemaOptions } from './baseSchema.js';

const adminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    password_hash: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  },
  baseSchemaOptions,
);

const AdminUser = mongoose.model('AdminUser', adminUserSchema, 'admin_users');

export default AdminUser;
