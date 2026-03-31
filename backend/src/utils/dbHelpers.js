import mongoose from 'mongoose';

function normalizeMongoIdValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeMongoIdValue(item));
  }

  if (typeof value === 'string' && mongoose.Types.ObjectId.isValid(value)) {
    return new mongoose.Types.ObjectId(value);
  }

  return value;
}

export function buildMongoFilter(filters = []) {
  const mongoFilter = {};

  for (const filter of filters) {
    const { column, operator, value } = filter;
    if (!column || !operator) continue;

    const key = column === 'id' ? '_id' : column;

    if (operator === 'eq') {
      if (key === '_id') {
        mongoFilter[key] = normalizeMongoIdValue(value);
      } else {
        mongoFilter[key] = value;
      }
    }

    if (operator === 'in') {
      mongoFilter[key] = {
        $in: key === '_id'
          ? normalizeMongoIdValue(Array.isArray(value) ? value : [value])
          : Array.isArray(value) ? value : [value],
      };
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

export function normalizeProjection(select) {
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

export function normalizeDoc(doc) {
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

export function applyPublicReadConstraints(table, filter) {
  if (table === 'posts') {
    return { ...filter, publicado: true };
  }
  if (table === 'projetos') {
    return { ...filter, status: 'published' };
  }
  if (table === 'autores') {
    return { ...filter, publicado: true };
  }
  if (table === 'depoimentos') {
    return { ...filter, ativo: true };
  }
  return filter;
}
