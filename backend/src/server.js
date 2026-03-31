import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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
import projetosRoutes from './routes/projetoRoutes.js';


const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGODB_URI) throw new Error('MONGODB_URI não configurada');
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET não configurada');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cliente R2 (opcional - apenas se configurado)
const r2 = process.env.R2_ACCOUNT_ID ? new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
}) : null;

const app = express();
app.use(express.json({ limit: '20mb' }));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// CORS
const corsOriginFn = (origin, callback) => {
  const env = process.env.CORS_ORIGIN;
  if (!env || env.trim() === '' || env.includes('*')) {
    return callback(null, true);
  }
  if (!origin) return callback(null, true);
  const allowed = env.split(',').map((o) => o.trim());
  if (allowed.includes(origin)) return callback(null, true);
  return callback(new Error('Not allowed by CORS'));
};
app.use(
  cors({
    origin: corsOriginFn,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Rotas
app.use('/api/comments', commentsRouter);
app.use('/api/interesse', interesseRouter);
app.use('/api/faq', faqRouter);
app.use('/api/auth', authRouter);
app.use('/api/db', dbRouter);
app.use('/api', projetosRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'svicerostudio-backend' }));

// Upload — agora vai para o R2
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

app.post('/api/storage/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { bucket, key } = req.body || {};
    const file = req.file;

    if (!bucket || !key || !file) {
      return res.status(400).json({ error: 'bucket, key e file são obrigatórios' });
    }

    // Se R2 está configurado, usar R2
    if (r2 && process.env.R2_BUCKET_NAME && process.env.R2_PUBLIC_URL) {
      try {
        await r2.send(
          new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
          }),
        );
        const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
        return res.json({ data: { path: key, url: publicUrl }, error: null });
      } catch (r2Error) {
        console.error('[UPLOAD R2 ERROR]', r2Error.message);
        // Fallback: salvar no MongoDB
      }
    }

    // Fallback: salvar no MongoDB
    console.log('[UPLOAD] R2 não configurado, salvando no MongoDB');
    const uploadDoc = await Upload.findOneAndUpdate(
      { bucket, storageKey: key },
      {
        $set: {
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          data: file.buffer,
          updated_at: new Date(),
        },
        $setOnInsert: {
          bucket,
          storageKey: key,
          created_at: new Date(),
        },
      },
      {
        upsert: true,
        new: true,
      },
    );

    // Retornar URL HTTP válida para servir a imagem
    const publicUrl = `${process.env.API_BASE_URL || `http://localhost:${PORT}`}/api/storage/${uploadDoc._id}`;
    return res.json({ data: { path: key, url: publicUrl, id: uploadDoc._id }, error: null });
  } catch (err) {
    console.error('[UPLOAD ERROR]', err.message, err.stack);
    return res.status(500).json({ error: err.message || 'Erro ao fazer upload' });
  }
});

// Servir arquivos legados que ainda estão no MongoDB
app.get('/api/storage/public/:bucket/:key', async (req, res) => {
  try {
    const { bucket, key } = req.params;
    const doc = await Upload.findOne({ bucket, storageKey: key });
    if (!doc) return res.status(404).send('Arquivo não encontrado');
    res.setHeader('Content-Type', doc.mimeType || 'application/octet-stream');
    res.setHeader('Content-Length', doc.size || 0);
    return res.send(doc.data);
  } catch (err) {
    console.error('[STORAGE ERROR]', err.message);
    return res.status(500).send('Erro ao buscar arquivo');
  }
});

// Servir arquivo por ID MongoDB
app.get('/api/storage/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Upload.findById(id);
    if (!doc) return res.status(404).send('Arquivo não encontrado');
    res.setHeader('Content-Type', doc.mimeType || 'application/octet-stream');
    res.setHeader('Content-Length', doc.size || 0);
    res.setHeader('Content-Disposition', `inline; filename="${doc.originalName || 'file'}"`);
    return res.send(doc.data);
  } catch (err) {
    console.error('[STORAGE ERROR]', err.message);
    return res.status(500).send('Erro ao buscar arquivo');
  }
});

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
