import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Modelos
import { AdminUser, Upload } from './models/index.js';

// Middleware
import { authMiddleware } from './middleware/auth.js';

// Rotas
import commentsRouter from './routes/comments.js';
import interesseRouter from './routes/interesse.js';
import faqRouter from './routes/faq.js';
import authRouter from './routes/auth.js';
import dbRouter from './routes/database.js';

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGODB_URI) throw new Error('MONGODB_URI não configurada');
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET não configurada');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '20mb' }));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// CORS robusto: aceita qualquer origem se CORS_ORIGIN não estiver definida ou vazia
app.use(
  cors({
    origin: (origin, callback) => {
      const env = process.env.CORS_ORIGIN;
      if (!env || env.trim() === '' || env.includes('*')) {
        return callback(null, true); // Permite qualquer origem
      }
      const allowed = env.split(',').map(o => o.trim());
      if (allowed.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rotas públicas e modularizadas
app.use('/api/comments', commentsRouter);
app.use('/api/interesse', interesseRouter);
app.use('/api/faq', faqRouter);
app.use('/api/auth', authRouter);
app.use('/api/db', dbRouter);

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'svicerostudio-backend' }));

// Storage — upload de arquivos (requer autenticação)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

app.post('/api/storage/upload', authMiddleware, upload.single('file'), async (req, res) => {
  const { bucket, key } = req.body || {};
  const file = req.file;

  if (!bucket || !key || !file) {
    return res.status(400).json({ error: 'bucket, key e file são obrigatórios' });
  }

  await Upload.findOneAndUpdate(
    { bucket, storageKey: key },
    {
      bucket,
      storageKey: key,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      data: file.buffer,
      created_at: new Date(),
    },
    { upsert: true, new: true },
  );

  return res.json({ data: { path: key }, error: null });
});

// Storage — servir arquivos públicos
app.get('/api/storage/public/:bucket/:key', async (req, res) => {
  const { bucket, key } = req.params;

  const doc = await Upload.findOne({ bucket, storageKey: key });
  if (!doc) {
    return res.status(404).send('Arquivo não encontrado');
  }

  res.setHeader('Content-Type', doc.mimeType || 'application/octet-stream');
  return res.send(doc.data);
});

// Cria o usuário admin a partir das variáveis de ambiente (se não existir)
async function ensureAdminFromEnv() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;

  const email = String(ADMIN_EMAIL).toLowerCase().trim();
  const existing = await AdminUser.findOne({ email });
  if (existing) return;

  const password_hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await AdminUser.create({ email, password_hash });
  console.log(`[boot] Usuário admin criado: ${email}`);
}

async function bootstrap() {
  await mongoose.connect(MONGODB_URI);
  await ensureAdminFromEnv();

  app.listen(PORT, () => {
    console.log(`[server] API Mongo rodando na porta ${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('[server] Falha ao iniciar API:', error);
  process.exit(1);
});
