import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:4000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const RESET_TARGET = String(process.env.RESET_TARGET || 'false').toLowerCase() === 'true';
const BATCH_SIZE = Number(process.env.BATCH_SIZE || 500);

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no backend/.env');
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error('Defina ADMIN_EMAIL e ADMIN_PASSWORD no backend/.env para autenticar na API');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const log = (message) => console.log(`[migrate] ${message}`);

async function apiLogin() {
  const response = await fetch(`${BACKEND_API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload?.token) {
    throw new Error(payload?.error || `Falha no login na API (${response.status})`);
  }

  return payload.token;
}

async function apiQuery(token, table, body) {
  const response = await fetch(`${BACKEND_API_URL}/api/db/${table}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error || `Erro na API (${table}) status=${response.status}`);
  }

  return payload?.data ?? null;
}

async function fetchAllFromSupabase(table, orderColumn = 'created_at') {
  const allRows = [];
  let from = 0;

  while (true) {
    const to = from + BATCH_SIZE - 1;
    const query = supabase
      .from(table)
      .select('*')
      .range(from, to);

    const { data, error } = orderColumn
      ? await query.order(orderColumn, { ascending: true, nullsFirst: true })
      : await query;

    if (error) {
      throw new Error(`Erro ao buscar ${table} no Supabase: ${error.message}`);
    }

    if (!data || data.length === 0) {
      break;
    }

    allRows.push(...data);

    if (data.length < BATCH_SIZE) {
      break;
    }

    from += BATCH_SIZE;
  }

  return allRows;
}

function sanitizeRow(row) {
  const sanitized = { ...row };
  delete sanitized.id;
  return sanitized;
}

async function deleteTargetTable(token, table) {
  await apiQuery(token, table, {
    operation: 'delete',
    filters: [],
  });
}

async function insertRows(token, table, rows) {
  if (!rows.length) return;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    await apiQuery(token, table, {
      operation: 'insert',
      payload: batch,
      returning: false,
    });
  }
}

async function migrateProjetosComGaleria(token) {
  const projetoIdMap = new Map();

  const projetos = await fetchAllFromSupabase('projetos', 'created_at');
  log(`projetos encontrados no Supabase: ${projetos.length}`);

  for (const projeto of projetos) {
    const inserted = await apiQuery(token, 'projetos', {
      operation: 'insert',
      payload: [sanitizeRow(projeto)],
      returning: true,
    });

    const newRow = Array.isArray(inserted) ? inserted[0] : null;
    if (!newRow?.id) {
      throw new Error('Falha ao inserir projeto e recuperar novo ID');
    }

    projetoIdMap.set(projeto.id, newRow.id);
  }

  const galeria = await fetchAllFromSupabase('projeto_galeria', 'ordem');
  log(`projeto_galeria encontrada no Supabase: ${galeria.length}`);

  const galeriaTransformada = galeria
    .map((item) => {
      const novoProjetoId = projetoIdMap.get(item.projeto_id);
      if (!novoProjetoId) return null;

      return {
        ...sanitizeRow(item),
        projeto_id: novoProjetoId,
      };
    })
    .filter(Boolean);

  await insertRows(token, 'projeto_galeria', galeriaTransformada);
  log(`projeto_galeria migrada: ${galeriaTransformada.length}`);
}

async function migrateTabelaSimples(token, table, orderColumn = 'created_at') {
  const rows = await fetchAllFromSupabase(table, orderColumn);
  log(`${table} encontrados no Supabase: ${rows.length}`);

  const transformed = rows.map((row) => sanitizeRow(row));
  await insertRows(token, table, transformed);
  log(`${table} migrados: ${transformed.length}`);
}

async function run() {
  log('Iniciando migração Supabase -> MongoDB API');

  const token = await apiLogin();
  log('Login na API OK');

  if (RESET_TARGET) {
    log('RESET_TARGET=true: limpando tabelas de destino');
    await deleteTargetTable(token, 'projeto_galeria');
    await deleteTargetTable(token, 'projetos');
    await deleteTargetTable(token, 'posts');
    await deleteTargetTable(token, 'autores');
    await deleteTargetTable(token, 'depoimentos');
  }

  await migrateProjetosComGaleria(token);
  await migrateTabelaSimples(token, 'autores', 'created_at');
  await migrateTabelaSimples(token, 'posts', 'created_at');
  await migrateTabelaSimples(token, 'depoimentos', 'ordem');

  log('Migração finalizada com sucesso ✅');
}

run().catch((error) => {
  console.error(`[migrate] Falha: ${error.message}`);
  process.exit(1);
});
