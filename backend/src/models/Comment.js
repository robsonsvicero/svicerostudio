
import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  postSlug: { type: String, required: true, index: true },
  name: { type: String, required: true },
  email: { type: String },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
});

export default mongoose.model('Comment', CommentSchema);
