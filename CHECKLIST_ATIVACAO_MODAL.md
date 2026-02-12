# ✅ Checklist de Ativação - Sistema Modal de Projetos

## 🚀 Passos para Ativar (Execute nesta ordem)

### 1. ✅ Configuração do Banco de Dados
**Arquivo:** `UPDATE_PROJETOS_MODAL.sql`

**O que fazer:**
1. Abra o Supabase Dashboard
2. Vá em **SQL Editor**
3. Cole TODO o conteúdo do arquivo `UPDATE_PROJETOS_MODAL.sql`
4. Clique em **RUN**

**O que isso faz:**
- Adiciona campos novos na tabela `projetos`
- Cria tabela `projeto_galeria` para imagens
- Configura bucket de storage `projeto-galeria`
- Define políticas de segurança (RLS)

---

### 2. ✅ Verificar Storage
**Onde:** Supabase Dashboard → Storage

**Verificar:**
- ☑️ Bucket `projeto-galeria` existe
- ☑️ Está marcado como **público**
- ☑️ Aceita imagens (jpeg, png, webp, gif)

**Se não existir:**
1. Clique em **New Bucket**
2. Nome: `projeto-galeria`
3. Public: **SIM** ✅
4. Salvar

---

### 3. ✅ Testar o Sistema

#### A) Cadastrar um Projeto Teste
1. Acesse: `http://localhost:5173/admin/projetos` (ou `/admin/projetos`)
2. Preencha:
   - Título: "Projeto Teste"
   - Descrição Curta: "Teste do novo sistema"
   - URL da Capa: qualquer imagem online
   - Link Behance: qualquer URL
   - Data do projeto: hoje
3. **Storytelling:**
   - Descrição Longa (PT): "Este é um projeto de teste para verificar se o sistema está funcionando corretamente."
   - Clique em **"Traduzir Automaticamente"**
   - Aguarde a tradução aparecer
4. **Galeria:**
   - Faça upload de 3-5 imagens de teste
   - Aguarde o upload concluir
5. **Link do Site:**
   - Adicione uma URL qualquer (ex: https://google.com)
6. Clique em **"Criar Projeto"**

#### B) Testar o Modal
1. Vá para a Home: `http://localhost:5173/`
2. Role até "Projetos Selecionados"
3. Clique no card do projeto
4. **Verificar:**
   - ☑️ Modal abre
   - ☑️ Galeria de imagens funciona
   - ☑️ Navegação com setas ← → funciona
   - ☑️ Seletor PT/EN alterna corretamente
   - ☑️ Botão "Visitar Site" aparece
   - ☑️ Botão "Ver no Behance" funciona
   - ☑️ ESC fecha o modal

---

## 🔧 Troubleshooting

### "Erro ao fazer upload das imagens"
**Solução:**
```sql
-- Execute no Supabase SQL Editor:
INSERT INTO storage.buckets (id, name, public)
VALUES ('projeto-galeria', 'projeto-galeria', true)
ON CONFLICT (id) DO UPDATE SET public = true;
```

### "Galeria vazia no modal"
**Verificar:**
1. No Supabase, vá em **Table Editor** → `projeto_galeria`
2. Verifique se as imagens foram salvas
3. Se não, tente fazer upload novamente

### "Tradução não funciona"
**Causa:** API pública pode ter rate limit ou estar temporariamente indisponível

**Soluções:**
1. **Aguarde 1-2 minutos** e tente novamente
2. O sistema tenta **2 APIs automaticamente**:
   - MyMemory (principal)
   - LibreTranslate (backup)
3. Se falhar, **escreva manualmente** a tradução em inglês
4. Verifique no **Console do navegador** (F12) se há erros específicos

**Alternativa Manual:**
- Use Google Translate ou DeepL
- Cole a tradução no campo "Descrição Completa (Inglês)"

---

## 📊 Resultados Esperados

### Antes (Sistema Antigo)
❌ Clique no card → redireciona para Behance
❌ Usuários saem do site
❌ Sem galeria de imagens
❌ Sem storytelling completo

### Depois (Sistema Novo)
✅ Clique no card → abre modal no próprio site
✅ Usuários permanecem no site
✅ Galeria de 10-15 imagens navegável
✅ Storytelling completo PT/EN
✅ Link do site (quando aplicável)
✅ Botão Behance como secundário

---

## 🎯 Próximos Passos

Após confirmar que tudo funciona:

1. **Migrar Projetos Existentes:**
   - Edite cada projeto no admin
   - Adicione galeria de imagens
   - Escreva storytelling completo
   - Use tradução automática

2. **Otimizações (Opcional):**
   - Comprimir imagens antes de upload
   - Adicionar lazy loading
   - Implementar cache de traduções

3. **Analytics:**
   - Acompanhe tempo de permanência
   - Veja quais projetos geram mais interesse

---

## 📞 Precisa de Ajuda?

Consulte o arquivo completo: [SISTEMA_MODAL_PROJETOS.md](./SISTEMA_MODAL_PROJETOS.md)

---

✅ **Sistema pronto para uso!**
