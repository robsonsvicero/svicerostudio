# 📸 Sistema de Modal de Projetos - Guia de Instalação

Sistema completo para gerenciar projetos com galeria de imagens, tradução automática e modal interativo.

## 🎯 Funcionalidades

- ✅ Modal de projeto ao invés de redirecionar para Behance
- ✅ Galeria de 10-15 imagens por projeto
- ✅ Storytelling completo (descrição longa)
- ✅ Tradução automática PT ↔ EN usando LibreTranslate
- ✅ Link do site (quando aplicável)
- ✅ Navegação de imagens com teclado (setas ← →)
- ✅ Seletor de idioma PT/EN no modal
- ✅ Animações suaves com Framer Motion

---

## 📦 Instalação

### 1. Dependências já instaladas
```bash
npm install framer-motion
```
✅ Já executado automaticamente!

---

## 🗄️ Configuração do Banco de Dados (Supabase)

### Passo 1: Executar Script SQL

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Abra o arquivo `UPDATE_PROJETOS_MODAL.sql`
4. Copie e cole o conteúdo no editor
5. Clique em **RUN** para executar

Este script irá:
- ✅ Adicionar campos `descricao_longa`, `descricao_longa_en` e `site_url` na tabela `projetos`
- ✅ Criar tabela `projeto_galeria` para múltiplas imagens
- ✅ Configurar índices e políticas de segurança (RLS)
- ✅ Criar bucket de storage `projeto-galeria`

### Passo 2: Configurar Storage

1. Vá em **Storage** no Supabase Dashboard
2. Verifique se o bucket **projeto-galeria** foi criado
3. Se não foi criado automaticamente:
   - Clique em **New Bucket**
   - Nome: `projeto-galeria`
   - Public: ✅ Sim
   - Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`
   - Max file size: `5MB`

---

## 🚀 Como Usar

### Cadastrar um Projeto Completo

1. **Acesse o Admin de Projetos**
   ```
   /admin/projetos
   ```

2. **Preencha os campos obrigatórios:**
   - Título do projeto
   - Descrição curta (para o card)
   - URL da imagem de capa
   - Link do Behance/Portfolio
   - Data do projeto

3. **Storytelling (Descrição Longa):**
   - Escreva a história completa em português
   - Clique em **"Traduzir Automaticamente"**
   - O sistema usa LibreTranslate para gerar a versão em inglês
   - Você pode editar a tradução se necessário

4. **Galeria de Imagens:**
   - Clique na área de upload ou arraste 10-15 imagens
   - As imagens serão enviadas para o Supabase Storage
   - Use os botões ← → para reordenar
   - Use o botão 🗑️ para remover

5. **Link do Site (Opcional):**
   - Se o projeto incluiu desenvolvimento de site, adicione a URL
   - O botão "Visitar Site" aparecerá no modal automaticamente

6. **Salvar:**
   - Clique em **"Criar Projeto"**
   - O sistema salva o projeto + galeria automaticamente

### Ver Projeto no Site

1. O card do projeto aparece na seção **"Projetos Selecionados"**
2. Clique no card para abrir o modal
3. Navegue pelas imagens usando:
   - Botões ← → na tela
   - Setas do teclado
   - Indicadores na parte inferior
4. Alterne entre PT/EN no canto superior esquerdo
5. Clique nos botões de ação:
   - **Visitar Site** (se tiver `site_url`)
   - **Ver no Behance**
   - Link adicional (se configurado)

---

## 🌐 Tradução Automática

### Usando LibreTranslate (API Pública)

Por padrão, o sistema usa a API pública gratuita do LibreTranslate:
- ✅ Gratuito
- ⚠️ Limitado a algumas requisições por hora
- ✅ Ideal para testes e projetos pequenos

### Para Produção (Recomendado)

Para uso intensivo, considere hospedar sua própria instância:

1. **Hospedar LibreTranslate:**
   ```bash
   docker run -d -p 5000:5000 libretranslate/libretranslate
   ```

2. **Atualizar a configuração:**
   Abra `src/services/translateService.js` e altere:
   ```javascript
   const LIBRETRANSLATE_API = 'http://seu-servidor:5000/translate';
   ```

3. **Usar API Key (opcional mas recomendado):**
   ```javascript
   const LIBRETRANSLATE_API_KEY = 'sua-api-key-aqui';
   ```

---

## 📁 Arquivos Criados/Modificados

### Novos Arquivos
- ✅ `UPDATE_PROJETOS_MODAL.sql` - Script SQL para banco de dados
- ✅ `src/services/translateService.js` - Serviço de tradução
- ✅ `src/components/ProjectModal.jsx` - Componente do modal
- ✅ `SISTEMA_MODAL_PROJETOS.md` - Este guia

### Arquivos Modificados
- ✅ `src/pages/AdminProjetos.jsx` - Upload múltiplo + tradução
- ✅ `src/pages/Home.jsx` - Query atualizada com novos campos
- ✅ `src/components/Home/ProjectsSection.jsx` - Integração com modal
- ✅ `package.json` - Adicionado framer-motion

---

## 🎨 Melhorias Futuras (Opcional)

- [ ] Compressão automática de imagens no upload
- [ ] Drag & drop para reordenar imagens
- [ ] Crop de imagens integrado
- [ ] Preview do modal ao cadastrar
- [ ] Lazy loading de imagens otimizado
- [ ] Zoom de imagens no modal
- [ ] Compartilhamento social do projeto
- [ ] Analytics de projetos mais visualizados

---

## 🆘 Troubleshooting

### "Erro ao fazer upload das imagens"
- Verifique se o bucket `projeto-galeria` está criado e público
- Confirme que as políticas de storage foram criadas
- Limite de 5MB por imagem

### "Erro ao traduzir texto"
- API pública pode ter rate limit
- Aguarde alguns minutos e tente novamente
- Considere hospedar própria instância do LibreTranslate

### "Modal não abre"
- Verifique se `framer-motion` está instalado
- Confirme que os projetos têm o campo `id` carregado
- Abra o console do navegador para ver erros

### "Imagens não aparecem no modal"
- Confirme que as imagens foram salvas na tabela `projeto_galeria`
- Verifique se as URLs das imagens são acessíveis
- Confira as políticas de RLS da tabela `projeto_galeria`

---

## ✅ Checklist de Verificação

Antes de usar em produção:

- [ ] Script SQL executado no Supabase
- [ ] Bucket `projeto-galeria` criado e público
- [ ] Políticas de RLS configuradas
- [ ] Testado upload de imagens
- [ ] Testado tradução automática
- [ ] Modal abre e fecha corretamente
- [ ] Navegação de imagens funciona
- [ ] Seletor de idioma PT/EN funciona
- [ ] Botões de ação redirecionam corretamente
- [ ] Responsivo em mobile

---

## 💡 Dicas de Uso

1. **Qualidade das Imagens:**
   - Use imagens de alta qualidade (mínimo 1920x1080)
   - Mantenha proporção consistente
   - Compacte antes de fazer upload (< 2MB cada)

2. **Storytelling:**
   - Conte a história do projeto
   - Explique desafios e soluções
   - Mostre o antes e depois
   - Destaque resultados alcançados

3. **Ordem das Imagens:**
   - Primeira imagem: Overview/hero
   - Segunda imagem: Detalhe importante
   - Últimas imagens: Resultado final

4. **SEO:**
   - Use títulos descritivos
   - Escreva descrições completas
   - Adicione palavras-chave relevantes

---

## 🎉 Pronto!

Agora você tem um sistema completo de portfólio com modal profissional!

Se tiver dúvidas, consulte os comentários no código ou abra uma issue.
