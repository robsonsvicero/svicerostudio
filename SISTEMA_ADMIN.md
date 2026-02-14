# Sistema Administrativo - Svicero Studio

## Arquitetura

- **Frontend**: React + Vite (hospedado na Hostinger)
- **Backend API**: Node.js + Express (Railway)
- **Banco de Dados**: MongoDB Atlas

---

## Rotas Administrativas

| Rota | Função |
|------|--------|
| `/login` | Autenticação do administrador |
| `/admin` | Dashboard principal |
| `/admin/projetos` | Gerenciar projetos |
| `/admin/blog` | Gerenciar posts do blog |
| `/admin/autores` | Gerenciar autores |
| `/admin/depoimentos` | Gerenciar depoimentos |

---

## Autenticação

### Login
1. Acesse `/login`
2. Insira email e senha do admin
3. Token JWT é salvo no localStorage
4. Redirecionamento para `/admin`

### Credenciais
Configuradas no Railway via variáveis de ambiente:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

O admin é criado automaticamente ao iniciar a API.

---

## Módulos

### 1. Projetos (`/admin/projetos`)

**Campos:**
- Título
- Descrição curta
- Descrição longa (storytelling)
- URL da capa
- Link do Behance
- Link do site (opcional)
- Data do projeto
- Galeria de imagens

**Funcionalidades:**
- CRUD completo
- Upload de galeria (10-15 imagens)
- Tradução automática PT → EN
- Modal interativo no frontend

### 2. Blog (`/admin/blog`)

**Campos:**
- Título
- Slug (URL amigável)
- Resumo
- Conteúdo (Markdown)
- Imagem de destaque
- Categoria
- Autor (dropdown)
- Data de publicação
- Status (publicado/rascunho)

**Funcionalidades:**
- CRUD completo
- Seleção de autor via dropdown
- Preview do conteúdo
- SEO automático via slug

### 3. Autores (`/admin/autores`)

**Campos:**
- Nome (obrigatório)
- Cargo (obrigatório)
- Foto (base64)
- Bio
- Email
- Status (publicado/não publicado)

**Funcionalidades:**
- CRUD completo
- Editor de foto com crop
- Autores publicados aparecem no dropdown do blog

### 4. Depoimentos (`/admin/depoimentos`)

**Campos:**
- Nome
- Cargo
- Empresa
- Texto
- Nota (1-5 estrelas)
- Iniciais (avatar)
- Cor do avatar
- Status (ativo/inativo)
- Ordem

**Funcionalidades:**
- CRUD completo
- Ordenação customizável
- Avatares coloridos automáticos

---

## Editor de Foto (Autores)

Modal para enquadrar fotos de perfil:

**Como usar:**
1. Clique em "Selecionar arquivo" ou cole com Ctrl+V
2. Modal abre automaticamente
3. Arraste a imagem para posicionar
4. Use o slider para ajustar zoom (50% - 300%)
5. Clique "Confirmar"

**Especificações:**
- Saída: 400x400px (quadrado)
- Formato: JPEG 90%
- Armazenamento: Base64 no MongoDB

---

## API Endpoints

Base URL: `https://svicerostudio-production.up.railway.app`

### Autenticação
```
POST /api/auth/login
Body: { "email": "...", "password": "..." }
Response: { "token": "jwt...", "user": {...} }
```

### CRUD Genérico
```
POST /api/db/:table/query
Body: { "filters": {...}, "order": {...}, "limit": 10 }

POST /api/db/:table/insert
Body: { "data": {...} }

POST /api/db/:table/update
Body: { "filters": {...}, "data": {...} }

POST /api/db/:table/delete
Body: { "filters": {...} }
```

### Tabelas Disponíveis
- `projetos`
- `projeto_galeria`
- `posts`
- `autores`
- `depoimentos`

### Upload de Imagens
```
POST /api/storage/upload
Headers: { "Authorization": "Bearer <token>" }
Body: FormData com campo "file"
Response: { "url": "/api/storage/..." }
```

---

## Fluxos de Uso

### Criar Autor
```
1. Acessar /admin/autores
2. Preencher Nome e Cargo
3. Fazer upload de foto
4. Posicionar no editor de crop
5. Confirmar crop
6. Adicionar Bio e Email (opcional)
7. Marcar como Publicado
8. Clicar "Criar"
```

### Criar Post no Blog
```
1. Acessar /admin/blog
2. Preencher Título
3. Gerar Slug automaticamente
4. Escrever Resumo e Conteúdo
5. Selecionar Categoria
6. Selecionar Autor (dropdown)
7. Definir Data de Publicação
8. Marcar como Publicado
9. Clicar "Criar"
```

### Criar Projeto
```
1. Acessar /admin/projetos
2. Preencher dados básicos
3. Escrever Descrição Longa (PT)
4. Clicar "Traduzir" para gerar EN
5. Fazer upload da Galeria
6. Salvar Projeto
```

---

## Segurança

- Todas as rotas `/admin/*` são protegidas
- Token JWT expira em 7 dias
- Requests autenticados incluem header `Authorization: Bearer <token>`
- CORS configurado para domínios específicos
- Senhas hasheadas com bcrypt

---

## Troubleshooting

### Login não funciona
- Verificar se API está online (health check)
- Confirmar email e senha corretos
- Limpar localStorage e tentar novamente

### Dados não carregam
- Verificar console (F12) para erros
- Confirmar `VITE_API_URL` no .env
- Testar endpoint diretamente no navegador

### Upload falha
- Verificar se está autenticado
- Confirmar tamanho do arquivo
- Verificar logs da API no Railway

---

## Referências

- [MIGRACAO_MONGODB_RAILWAY.md](MIGRACAO_MONGODB_RAILWAY.md) - Arquitetura completa
- [DEPLOY-CHECKLIST.md](DEPLOY-CHECKLIST.md) - Checklist de deploy
- [backend/README.md](backend/README.md) - Documentação da API
