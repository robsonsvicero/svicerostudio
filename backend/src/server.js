import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI não configurada');
}

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não configurada');
}

const allowedTables = new Set(['projetos', 'projeto_galeria', 'posts', 'autores', 'depoimentos']);

const app = express();
app.use(express.json({ limit: '20mb' }));

const corsOrigins = CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);
app.use(
  cors({
    origin: corsOrigins.length === 1 && corsOrigins[0] === '*' ? true : corsOrigins,
    credentials: true,
  }),
);

const baseSchemaOptions = {
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id?.toString();
      delete ret._id;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id?.toString();
      delete ret._id;
      return ret;
    },
  },
};

const projetoSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    descricao_longa: String,
    descricao_longa_en: String,
    imagem_url: { type: String, required: true },
    site_url: String,
    link: { type: String, required: true },
    button_text: { type: String, default: 'Ver Projeto' },
    link2: String,
    button_text2: String,
    data_projeto: String,
    mostrar_home: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  baseSchemaOptions,
);

const projetoGaleriaSchema = new mongoose.Schema(
  {
    projeto_id: { type: String, required: true, index: true },
    imagem_url: { type: String, required: true },
    ordem: { type: Number, default: 0 },
    legenda: String,
    created_at: { type: Date, default: Date.now },
  },
  baseSchemaOptions,
);

const postSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    resumo: String,
    conteudo: { type: String, required: true },
    imagem_destaque: String,
    categoria: String,
    tags: String,
    data_publicacao: { type: String, required: true },
    autor: { type: String, default: 'Robson Svicero' },
    publicado: { type: Boolean, default: false, index: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  baseSchemaOptions,
);

const autorSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    cargo: { type: String, required: true },
    foto_url: String,
    bio: String,
    email: String,
    publicado: { type: Boolean, default: true, index: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  baseSchemaOptions,
);

const depoimentoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    cargo: String,
    empresa: String,
    texto: { type: String, required: true },
    nota: { type: Number, default: 5 },
    iniciais: String,
    cor_avatar: { type: String, default: 'orange' },
    ativo: { type: Boolean, default: true, index: true },
    ordem: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  baseSchemaOptions,
);

const adminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    password_hash: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  },
  baseSchemaOptions,
);

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

const Projeto = mongoose.model('Projeto', projetoSchema, 'projetos');
const ProjetoGaleria = mongoose.model('ProjetoGaleria', projetoGaleriaSchema, 'projeto_galeria');
const Post = mongoose.model('Post', postSchema, 'posts');
const Autor = mongoose.model('Autor', autorSchema, 'autores');
const Depoimento = mongoose.model('Depoimento', depoimentoSchema, 'depoimentos');
const AdminUser = mongoose.model('AdminUser', adminUserSchema, 'admin_users');
const Upload = mongoose.model('Upload', uploadSchema, 'uploads');

const tableModelMap = {
  projetos: Projeto,
  projeto_galeria: ProjetoGaleria,
  posts: Post,
  autores: Autor,
  depoimentos: Depoimento,
};

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

function decodeToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const payload = decodeToken(token);
  if (!payload?.sub) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  const user = await AdminUser.findById(payload.sub).lean();
  if (!user) {
    return res.status(401).json({ error: 'Usuário inválido' });
  }

  req.user = { id: user._id.toString(), email: user.email };
  return next();
}

function buildMongoFilter(filters = []) {
  const mongoFilter = {};

  for (const filter of filters) {
    const { column, operator, value } = filter;
    if (!column || !operator) continue;

    const key = column === 'id' ? '_id' : column;

    if (operator === 'eq') {
      if (key === '_id' && mongoose.Types.ObjectId.isValid(value)) {
        mongoFilter[key] = new mongoose.Types.ObjectId(value);
      } else {
        mongoFilter[key] = value;
      }
    }

    if (operator === 'ilike') {
      const escaped = String(value || '')
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/%/g, '.*');
      mongoFilter[key] = { $regex: `^${escaped}$`, $options: 'i' };
    }
  }

  return mongoFilter;
}

function normalizeProjection(select) {
  if (!select || select === '*') return null;

  const projection = {};
  String(select)
    .split(',')
    .map((field) => field.trim())
    .filter(Boolean)
    .forEach((field) => {
      projection[field === 'id' ? '_id' : field] = 1;
    });

  return projection;
}

function normalizeDoc(doc) {
  if (!doc) return null;
  if (Array.isArray(doc)) return doc.map((item) => normalizeDoc(item));

  const plain = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  plain.id = plain._id?.toString();
  delete plain._id;
  return plain;
}

function applyPublicReadConstraints(table, filter) {
  if (table === 'posts') {
    return { ...filter, publicado: true };
  }
  if (table === 'autores') {
    return { ...filter, publicado: true };
  }
  if (table === 'depoimentos') {
    return { ...filter, ativo: true };
  }
  return filter;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'svicerostudio-backend' });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  const user = await AdminUser.findOne({ email: String(email).toLowerCase().trim() });
  if (!user) {
    return res.status(401).json({ error: 'Invalid login credentials' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid login credentials' });
  }

  const normalizedUser = { id: user._id.toString(), email: user.email };
  const token = signToken(normalizedUser);

  return res.json({ token, user: normalizedUser });
});

app.get('/api/auth/session', authMiddleware, async (req, res) => {
  return res.json({ user: req.user });
});

app.post('/api/db/:table/query', async (req, res) => {
  const { table } = req.params;
  const {
    operation = 'select',
    select = '*',
    filters = [],
    orderBy = null,
    limit = null,
    payload = null,
    single = false,
    returning = false,
  } = req.body || {};

  if (!allowedTables.has(table)) {
    return res.status(404).json({ error: 'Tabela inválida' });
  }

  const Model = tableModelMap[table];
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const authPayload = token ? decodeToken(token) : null;
  const isAuthenticated = !!authPayload?.sub;

  if (operation !== 'select' && !isAuthenticated) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  try {

    let mongoFilter = buildMongoFilter(filters);

    // Corrige filtro para autores: usa 'id' ao invés de '_id' se o filtro contiver 'id' (UUID)
    if (table === 'autores' && mongoFilter._id && typeof mongoFilter._id === 'string') {
      mongoFilter.id = mongoFilter._id;
      delete mongoFilter._id;
    }

    if (!isAuthenticated && operation === 'select') {
      mongoFilter = applyPublicReadConstraints(table, mongoFilter);
    }

    if (operation === 'select') {
      const projection = normalizeProjection(select);
      let query = Model.find(mongoFilter);

      if (projection) query = query.select(projection);
      if (orderBy?.column) {
        const orderField = orderBy.column === 'id' ? '_id' : orderBy.column;
        query = query.sort({ [orderField]: orderBy.ascending === false ? -1 : 1 });
      }
      if (limit) query = query.limit(Number(limit));

      const docs = await query.lean();
      const data = normalizeDoc(docs);

      if (single) {
        return res.json({ data: data?.[0] || null, error: null });
      }

      return res.json({ data: data || [], error: null });
    }

    if (operation === 'insert') {
      const items = Array.isArray(payload) ? payload : [payload];
      const now = new Date();
      const rows = items.map((item) => ({ ...item, created_at: item.created_at || now, updated_at: now }));
      const inserted = await Model.insertMany(rows);
      return res.json({ data: returning ? normalizeDoc(inserted) : null, error: null });
    }

    if (operation === 'update') {
      const updatePayload = { ...(payload || {}), updated_at: new Date() };
      await Model.updateMany(mongoFilter, { $set: updatePayload });

      if (returning) {
        const updated = await Model.find(mongoFilter).lean();
        return res.json({ data: normalizeDoc(updated), error: null });
      }

      return res.json({ data: null, error: null });
    }

    if (operation === 'delete') {
      await Model.deleteMany(mongoFilter);
      return res.json({ data: null, error: null });
    }

    return res.status(400).json({ error: 'Operação inválida' });
  } catch (error) {
    // Log detalhado para depuração
    console.error('[API ERRO /api/db/:table/query]', {
      table,
      operation,
      filters,
      payload,
      error: error,
      errorMessage: error?.message,
      stack: error?.stack,
    });
    if (error?.code === 11000) {
      return res.status(409).json({ error: 'Duplicate key violation' });
    }
    return res.status(500).json({ error: error.message || 'Erro interno', details: error });
  }
});

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

app.get('/api/storage/public/:bucket/:key', async (req, res) => {
  const { bucket, key } = req.params;

  const doc = await Upload.findOne({ bucket, storageKey: key }).lean();
  if (!doc) {
    return res.status(404).send('Arquivo não encontrado');
  }

  res.setHeader('Content-Type', doc.mimeType || 'application/octet-stream');
  return res.send(doc.data);
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
