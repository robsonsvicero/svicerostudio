# Svicero Studio - Backend API

API Node.js/Express com MongoDB para o portfólio Svicero Studio.

## Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Auth**: JWT (jsonwebtoken)
- **Password**: bcryptjs
- **Upload**: multer

## Setup Local

### 1. Instalar dependências
```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Edite .env com suas credenciais
```

### 3. Rodar em desenvolvimento
```bash
npm run dev
```

API disponível em `http://localhost:4000`

## Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `PORT` | Porta da API (default: 4000) | Não |
| `MONGODB_URI` | String de conexão MongoDB Atlas | Sim |
| `JWT_SECRET` | Segredo para tokens JWT (32+ chars) | Sim |
| `CORS_ORIGIN` | Domínios permitidos (separados por vírgula) | Não |
| `ADMIN_EMAIL` | Email do admin inicial | Não |
| `ADMIN_PASSWORD` | Senha do admin inicial | Não |

## Endpoints

### Health Check
```
GET /health
Response: { "ok": true, "timestamp": "..." }
```

### Autenticação
```
POST /api/auth/login
Body: { "email": "admin@email.com", "password": "senha" }
Response: { "token": "jwt...", "user": { "id": "...", "email": "..." } }
```

### CRUD Genérico

**Query (buscar)**
```
POST /api/db/:table/query
Headers: Authorization: Bearer <token> (opcional para algumas tabelas)
Body: {
  "filters": { "publicado": true },
  "order": { "created_at": "desc" },
  "limit": 10
}
```

**Insert (criar)**
```
POST /api/db/:table/insert
Headers: Authorization: Bearer <token>
Body: { "data": { "titulo": "...", "descricao": "..." } }
```

**Update (atualizar)**
```
POST /api/db/:table/update
Headers: Authorization: Bearer <token>
Body: {
  "filters": { "id": "..." },
  "data": { "titulo": "Novo título" }
}
```

**Delete (excluir)**
```
POST /api/db/:table/delete
Headers: Authorization: Bearer <token>
Body: { "filters": { "id": "..." } }
```

### Tabelas Disponíveis

| Tabela | Descrição |
|--------|-----------|
| `projetos` | Projetos do portfólio |
| `projeto_galeria` | Imagens da galeria de projetos |
| `posts` | Artigos do blog |
| `autores` | Autores dos artigos |
| `depoimentos` | Depoimentos de clientes |

### Upload de Imagens
```
POST /api/storage/upload
Headers: Authorization: Bearer <token>
Body: FormData com campo "file"
Response: { "url": "/api/storage/files/..." }
```

**Download de imagem**
```
GET /api/storage/files/:id
Response: Imagem (binary)
```

## Schemas

### Projeto
```javascript
{
  titulo: String,          // obrigatório
  descricao: String,       // obrigatório
  descricao_longa: String,
  descricao_longa_en: String,
  imagem_url: String,      // obrigatório
  site_url: String,
  link: String,            // obrigatório
  button_text: String,
  link2: String,
  button_text2: String,
  data_projeto: String,
  mostrar_home: Boolean
}
```

### Post
```javascript
{
  titulo: String,          // obrigatório
  slug: String,            // obrigatório, único
  resumo: String,
  conteudo: String,        // obrigatório
  imagem_destaque: String,
  categoria: String,
  tags: String,
  data_publicacao: String, // obrigatório
  autor: String,
  publicado: Boolean
}
```

### Autor
```javascript
{
  nome: String,            // obrigatório
  cargo: String,           // obrigatório
  foto_url: String,        // base64
  bio: String,
  email: String,
  publicado: Boolean
}
```

### Depoimento
```javascript
{
  nome: String,            // obrigatório
  cargo: String,
  empresa: String,
  texto: String,           // obrigatório
  nota: Number,            // 1-5
  iniciais: String,
  cor_avatar: String,
  ativo: Boolean,
  ordem: Number
}
```

## Deploy no Railway

1. Conectar repositório no Railway
2. Configurar **Root Directory**: `backend`
3. Adicionar variáveis de ambiente
4. Deploy automático via push

## Scripts

```bash
npm run dev    # Desenvolvimento com nodemon
npm start      # Produção
```

## Segurança

- Tokens JWT expiram em 7 dias
- Senhas hasheadas com bcrypt (10 rounds)
- CORS configurável por domínio
- Rotas de escrita protegidas por autenticação
