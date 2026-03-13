import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  pergunta: { type: String, required: true },
  resposta: { type: String, required: true },
  ordem: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, {
  versionKey: false
});

export default mongoose.model('FAQ', faqSchema);
