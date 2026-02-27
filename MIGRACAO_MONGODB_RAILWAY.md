# Migração para MongoDB + Railway

Este projeto foi migrado para usar **API própria (Node/Express)** + **MongoDB Atlas** + **Railway**.

## 1) O que mudou no código

- Backend novo em `backend/` com:
  - autenticação admin por JWT
  - CRUD de `projetos`, `projeto_galeria`, `posts`, `autores`, `depoimentos`
  - upload de imagens da galeria no próprio MongoDB

## 2) Setup local rápido

### 2.1 Backend

1. Entre na pasta backend:

```bash
cd backend
```

2. Instale dependências:

```bash
npm install
```

3. Crie o arquivo `.env` baseado em `backend/.env.example`.

4. Suba a API:

```bash
npm run dev
```

A API sobe em `http://localhost:4000`.

### 2.2 Frontend

1. Na raiz do projeto, crie `.env` com:

```env
VITE_API_URL=http://localhost:4000
```

2. Instale e rode:

```bash
npm install
npm run dev
```

## 3) O que criar no MongoDB Atlas (passo a passo)

1. Acesse: https://cloud.mongodb.com
2. Crie um **Project** (ex.: `svicerostudio`).
3. Crie um **Cluster** (M0 gratuito já funciona).
4. Em **Database Access**:
   - crie usuário (ex.: `svicero_api`)
   - senha forte
5. Em **Network Access**:
   - para testes, liberar `0.0.0.0/0`
   - depois restrinja para maior segurança
6. Em **Clusters > Connect > Drivers** copie a connection string:

```txt
mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/svicerostudio?retryWrites=true&w=majority
```

7. Use essa string no `MONGODB_URI` da API.

### Collections esperadas

A API cria/usa automaticamente:

- `admin_users`
- `projetos`
- `projeto_galeria`
- `posts`
- `autores`
- `depoimentos`
- `uploads`

## 4) O que criar no Railway (passo a passo)

1. Acesse: https://railway.app/dashboard
2. Clique em **New Project**.
3. Selecione **Deploy from GitHub Repo**.
4. Escolha este repositório.
5. No serviço da API, configure o **Root Directory** como:

```txt
backend
```

6. Em **Variables**, adicione:

- `MONGODB_URI` = sua string do Atlas
- `JWT_SECRET` = segredo forte (32+ chars)
- `CORS_ORIGIN` = domínio do frontend (e.g. `https://svicerostudio.com.br`)
- `ADMIN_EMAIL` = email do primeiro admin
- `ADMIN_PASSWORD` = senha do primeiro admin
- `PORT` = `4000` (opcional, Railway normalmente injeta)

7. Faça deploy e copie a URL pública da API (ex.: `https://svicerostudio-api.up.railway.app`).

## 5) Apontar o frontend para Railway

No frontend (host atual), configure variável:

```env
VITE_API_URL=https://svicerostudio-api.up.railway.app
```

Depois gere novo build e publique.

## 6) Checklist de validação pós-migração

- `/login` autentica com usuário admin do Mongo
- `/admin/projetos` cria/edita/exclui projeto
- upload da galeria funciona
- Home lista projetos e depoimentos
- Blog lista posts publicados
- Post detalhado carrega autor e comentários

## 7) Segurança recomendada (produção)

- Trocar `CORS_ORIGIN=*` por domínio explícito
- Usar senha forte no `ADMIN_PASSWORD`
- Rotacionar `JWT_SECRET` periodicamente
- Restringir IPs no MongoDB Network Access
- Habilitar backup no Atlas
