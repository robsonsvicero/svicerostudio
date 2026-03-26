# Svicero Studio - Backend

API Node.js/Express para o portfólio Svicero Studio com suporte a Mongoose (MongoDB), JWT, AWS S3, e-mail e muito mais.

## Instalação

```bash
npm install
```

## Configuração

Crie um arquivo `.env` na raiz com base em `.env.example`:

```bash
cp .env.example .env
```

Configure as variáveis de ambiente necessárias (MongoDB, JWT_SECRET, SMTP, etc.).

## Executar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

## Estrutura

```
src/
├── middleware/       # Middlewares (autenticação, etc)
├── models/          # Modelos Mongoose
├── routes/          # Rotas da API
├── utils/           # Funções utilitárias
└── server.js        # Arquivo principal
```

## API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `GET /api/auth/session` - Verificar sessão

### Banco de Dados
- `POST /api/db/:table/query` - Executar queries (select, insert, update, delete)

### Comentários
- `GET /api/comments/:slug` - Listar comentários de um post
- `POST /api/comments/:slug` - Criar comentário
- `GET /api/comments/` - Listar todos (admin)
- `PATCH /api/comments/:id/approve` - Aprovar comentário (admin)
- `DELETE /api/comments/:id` - Deletar comentário (admin)

### FAQ
- `GET /api/faq` - Listar FAQs
- `POST /api/faq` - Criar FAQ (admin)
- `PUT /api/faq/:id` - Editar FAQ (admin)
- `DELETE /api/faq/:id` - Deletar FAQ (admin)

### Interesse
- `POST /api/interesse` - Enviar formulário de interesse

### Projetos
- `DELETE /api/projetos/:id` - Deletar projeto e galeria (admin)

### Health Check
- `GET /api/health` - Verificar status da API

## Dependências Principais

- **express** 5.1.0 - Framework web
- **mongoose** 8.19.2 - MongoDB ODM
- **jsonwebtoken** 9.0.2 - JWT para autenticação
- **@aws-sdk/client-s3** 3.1011.0 - AWS S3 client
- **nodemailer** 8.0.2 - Envio de emails
- **multer** 2.0.2 - Upload de arquivos
- **sharp** 0.34.5 - Processamento de imagens
- **bcryptjs** 3.0.2 - Hashing de senhas

## Autores

Robson Svicero
