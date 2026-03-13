import mongoose from 'mongoose';
import { baseSchemaOptions } from './baseSchema.js';

const uploadSchema = new mongoose.Schema(
  {
    bucket: { type: String, required: true, index: true },
    storageKey: { type: String, required: true, index: true },
    originalName: String,
    mimeType: { type: String, required: true },
    size: Number,
    data: { type: Buffer, required: true },
    created_at: { type: Date, default: Date.now },
  },
  baseSchemaOptions,
);
uploadSchema.index({ bucket: 1, storageKey: 1 }, { unique: true });

const Upload = mongoose.model('Upload', uploadSchema, 'uploads');

export default Upload;
