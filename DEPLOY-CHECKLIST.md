# Checklist de Deploy - Svicero Studio

## Arquitetura

- **Frontend**: Hostinger (estático)
- **Backend API**: Railway (Node/Express)
- **Banco de Dados**: MongoDB Atlas

---

## 1. Backend (Railway)

### Antes do Deploy
- [ ] Código commitado e pushado para GitHub
- [ ] `backend/.env.example` atualizado (sem segredos)

### Variáveis de Ambiente no Railway
- [ ] `MONGODB_URI` - String de conexão do MongoDB Atlas
- [ ] `JWT_SECRET` - Segredo para tokens JWT (32+ chars)
- [ ] `CORS_ORIGIN` - Domínios permitidos (ex: `https://svicerostudio.com.br`)
- [ ] `ADMIN_EMAIL` - Email do admin inicial
- [ ] `ADMIN_PASSWORD` - Senha do admin inicial
- [ ] `PORT` - Porta (Railway injeta automaticamente)

### Validação do Backend
- [ ] Health check OK: `https://[sua-url-railway]/health`
- [ ] Resposta: `{ "ok": true, "timestamp": "..." }`
- [ ] Logs sem erros no Railway Dashboard

---

## 2. Frontend (Hostinger)

### Antes do Deploy
- [ ] `.env` configurado com `VITE_API_URL=https://[sua-url-railway]`
- [ ] Build executado: `npm run build`
- [ ] Arquivos verificados na pasta `dist/`

### Upload para Hostinger
- [ ] Acessar Hostinger > Gerenciador de Arquivos
- [ ] Navegar até `public_html/`
- [ ] Deletar arquivos antigos
- [ ] Upload do conteúdo da pasta `dist/`
- [ ] Verificar estrutura:
  - [ ] `index.html` na raiz
  - [ ] Pasta `assets/`
  - [ ] `.htaccess`
  - [ ] `robots.txt`
  - [ ] `sitemap.xml`

---

## 3. Testes Pós-Deploy

### Páginas Públicas
- [ ] Home: https://svicerostudio.com.br/
- [ ] Blog: https://svicerostudio.com.br/blog
- [ ] Serviços funcionando
- [ ] Projetos carregando
- [ ] Depoimentos aparecendo

### Área Admin
- [ ] Login: https://svicerostudio.com.br/login
- [ ] Autenticação funciona
- [ ] CRUD de projetos OK
- [ ] CRUD de blog OK
- [ ] CRUD de autores OK
- [ ] CRUD de depoimentos OK
- [ ] Upload de imagens funciona

### Verificações Técnicas
- [ ] SSL ativo (https://)
- [ ] Console sem erros (F12)
- [ ] Requests para API retornando dados
- [ ] Responsivo em mobile

---

## 4. MongoDB Atlas

### Checklist
- [ ] Network Access: IP do Railway liberado (ou 0.0.0.0/0 para teste)
- [ ] Database Access: usuário com permissões corretas
- [ ] Collections criadas automaticamente pela API

---

## 5. Problemas Comuns

### API retorna erro 500
- Verificar logs no Railway Dashboard
- Confirmar `MONGODB_URI` está correta
- Testar conexão do MongoDB Atlas

### Erro de CORS
- Verificar `CORS_ORIGIN` no Railway
- Incluir domínios com e sem www

### Login não funciona
- Verificar se admin foi criado (logs do Railway)
- Confirmar `ADMIN_EMAIL` e `ADMIN_PASSWORD`

### Dados não aparecem
### Dados não aparecem
 Verificar se `VITE_API_URL` está correto no frontend
 Testar endpoint direto: `https://[api]/api/db/posts/query`

----

## Contatos de Suporte

- **Railway**: https://railway.app/help
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/
- **Hostinger**: https://www.hostinger.com.br/contato

---

**Data do Deploy**: __________
**Hora**: __________
**Status**: [ ] Sucesso  [ ] Problemas  [ ] Rollback necessário
**Notas**: _______________________________________________
