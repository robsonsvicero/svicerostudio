import express from 'express';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { tableModelMap } from '../models/index.js';
import { decodeToken } from '../middleware/auth.js';

const router = express.Router();

const allowedTables = new Set(['projetos', 'projeto_galeria', 'posts', 'autores', 'depoimentos']);

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

  let plain = doc;
  if (typeof doc.toObject === 'function') {
    plain = doc.toObject();
  } else {
    plain = { ...doc };
  }
  
  if (plain._id) {
    plain.id = plain._id.toString();
    delete plain._id;
  } else if (!plain.id && doc.id) {
    plain.id = doc.id;
  }
  return plain;
}

function applyPublicReadConstraints(table, filter) {
  if (table === 'posts') {
    return { ...filter, publicado: true };
  }
  if (table === 'projetos') {
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

router.post('/:table/query', async (req, res) => {
  const { table } = req.params;
  const {
    operation = 'select',
    select = '*',
    filters = [],
    orderBy = null,
    limit = null,
    payload = null,
    single = false,
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

    if (!isAuthenticated && operation === 'select') {
      mongoFilter = applyPublicReadConstraints(table, mongoFilter);
    }

    if (operation === 'select') {
      const projection = normalizeProjection(select);
      const pipeline = [];
      if (Object.keys(mongoFilter).length > 0) pipeline.push({ $match: mongoFilter });

      // Para posts: $lookup para resolver UUID do autor → nome.
      // Fallback: se o campo 'autor' for um nome direto (posts legados),
      // usa o valor bruto como autor_nome.
      if (table === 'posts') {
        pipeline.push({
          $lookup: {
            from: 'autores',
            localField: 'autor',
            foreignField: '_id',
            as: '_autor_info',
          },
        });
        pipeline.push({
          $addFields: {
            autor_nome: {
              $cond: {
                if: { $gt: [{ $size: '$_autor_info' }, 0] },
                then: { $arrayElemAt: ['$_autor_info.nome', 0] },
                else: '$autor', // fallback para posts legados com nome direto
              },
            },
            autor_foto: { $arrayElemAt: ['$_autor_info.foto_url', 0] },
          },
        });
        pipeline.push({ $project: { _autor_info: 0 } });
      }

      if (orderBy?.column) {
        const orderField = orderBy.column === 'id' ? '_id' : orderBy.column;
        pipeline.push({ $sort: { [orderField]: orderBy.ascending === false ? -1 : 1 } });
      }
      if (limit) pipeline.push({ $limit: Number(limit) });
      if (projection) pipeline.push({ $project: projection });
      if (pipeline.length === 0) pipeline.push({ $match: {} });

      const docs = await Model.aggregate(pipeline).allowDiskUse(true);
      const data = normalizeDoc(docs);

      if (single) {
        return res.json({ data: data?.[0] || null, error: null });
      }

      return res.json({ data: data || [], error: null });
    }

    if (operation === 'insert') {
      const items = Array.isArray(payload) ? payload : [payload];
      const now = new Date();
      let rows;
      if (table === 'autores' || table === 'posts' || table === 'depoimentos') {
        rows = items.map((item) => ({
          ...item,
          _id: item.id || item._id || uuidv4(),
          created_at: item.created_at || now,
          updated_at: now
        }));
      } else {
        rows = items.map((item) => ({ ...item, created_at: item.created_at || now, updated_at: now }));
      }
      const inserted = await Model.insertMany(rows);
      return res.json({ data: normalizeDoc(inserted), error: null });
    }

    if (operation === 'update') {
      // Remove campos que não devem ser persistidos: campos calculados ($lookup) e _id (imutável no MongoDB)
      // eslint-disable-next-line no-unused-vars
      const { id, _id, autor_nome, autor_foto, ...updateData } = payload;
      const updatePayload = { ...updateData, updated_at: new Date() };

      const updateResult = await Model.updateMany(mongoFilter, { $set: updatePayload });
      
      const updated = await Model.find(mongoFilter).lean();
      return res.json({ data: normalizeDoc(updated), error: null, matchedCount: updateResult.matchedCount, modifiedCount: updateResult.modifiedCount });
    }

    if (operation === 'delete') {
      await Model.deleteMany(mongoFilter);
      return res.json({ data: null, error: null });
    }

    return res.status(400).json({ error: 'Operação inválida' });
  } catch (error) {
    console.error('[API ERRO /api/db/:table/query]', {
      table,
      operation,
      filters,
      payload,
      error: error.message,
      stack: error.stack,
    });
    if (error?.code === 11000) {
      return res.status(409).json({ error: 'Duplicate key violation' });
    }
    return res.status(500).json({ error: error.message || 'Erro interno', details: error });
  }
});

export default router;
