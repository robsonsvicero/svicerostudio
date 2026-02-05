# 🧪 Teste Rápido de Integração - Sistema de Autores

## ⚡ Quick Start (5 minutos)

### 1️⃣ Preparar o Banco (1 min)
```bash
# Arquivo: CREATE_AUTORES_TABLE.sql

1. Abra: https://app.supabase.com
2. Selecione seu projeto
3. Vá em: SQL Editor
4. Crie uma nova query
5. Cole o conteúdo de CREATE_AUTORES_TABLE.sql
6. Execute (Ctrl+Enter)
7. Pronto! ✅
```

### 2️⃣ Iniciar o Servidor (1 min)
```bash
npm install
npm run dev
# ou
yarn dev
```

### 3️⃣ Criar Primeiro Autor (1.5 min)
```
1. Abra: http://localhost:5173/admin
2. Faça login
3. Clique em "Autores" (novo card)
4. Preencha:
   - Nome: "Seu Nome"
   - Cargo: "Sua Profissão"
   - Email: "seu@email.com"
   - Bio: "Uma descrição breve"
5. Clique em "Criar"
6. ✅ Autor criado!
```

### 4️⃣ Usar no Blog (1.5 min)
```
1. Vá a: http://localhost:5173/admin/blog
2. Crie um novo post
3. No campo "Autor", selecione seu autor do dropdown
4. Preencha outros campos
5. Publique
6. Vá a: http://localhost:5173/blog/:slug
7. ✅ Veja a seção "Sobre o Autor"!
```

---

## 🎯 Teste Funcional Completo (10 minutos)

### Teste 1: Criar Autores
```javascript
// Esperado:
1. Formulário carrega ✓
2. Upload de foto funciona ✓
3. Cola de imagem funciona (Ctrl+V) ✓
4. Validação de campos obrigatórios ✓
5. Mensagem de sucesso aparece ✓
6. Autor aparece na lista ✓
```

### Teste 2: Editar Autor
```javascript
// Esperado:
1. Dados carregam no formulário ✓
2. Pode alterar nome/cargo/email ✓
3. Pode atualizar foto ✓
4. Mensagem de sucesso aparece ✓
5. Lista atualiza imediatamente ✓
6. Ao clicar "Cancelar", form limpa ✓
```

### Teste 3: Excluir Autor
```javascript
// Esperado:
1. Confirmação aparece ✓
2. Autor removido da lista ✓
3. Mensagem de sucesso aparece ✓
```

### Teste 4: Status de Publicação
```javascript
// Esperado:
1. Ao desmarcar "Publicado" ✓
2. Autor não aparece no dropdown de blog ✓
3. Ao remarcar "Publicado" ✓
4. Autor reaparece no dropdown ✓
```

### Teste 5: Integração com Blog
```javascript
// Esperado:
1. Dropdown em /admin/blog carrega autores ✓
2. Pode selecionar autor ✓
3. Autor salvo com artigo ✓
4. Ao editar artigo, autor está pré-selecionado ✓
```

### Teste 6: Exibição no Artigo
```javascript
// Esperado:
1. Card "Sobre o Autor" aparece ✓
2. Foto do autor exibe ✓
3. Nome exibe corretamente ✓
4. Cargo exibe corretamente ✓
5. Bio exibe (se preenchida) ✓
6. Email é link clicável ✓
7. Layout responsivo em mobile ✓
```

---

## 🔍 Checklist de Bugs Comuns

### ❌ Problema: Dropdown vazio

**Checklist:**
```
☐ Tabela 'autores' existe no Supabase?
☐ Autores foram criados?
☐ Autores estão com "Publicado" = true?
☐ Página /admin/blog foi recarregada?
☐ Console sem erros? (F12)
```

**Solução:**
```javascript
// No console (F12):
const { data } = await supabase
  .from('autores')
  .select('*')
  .eq('publicado', true);
console.log(data); // Deve mostrar autores
```

### ❌ Problema: Erro ao criar autor

**Checklist:**
```
☐ Nome preenchido?
☐ Cargo preenchido?
☐ Imagem menor que 5MB?
☐ Email em formato válido?
☐ Conexão com Supabase OK?
```

**Solução:**
```javascript
// Verifique a conexão no console:
const { data } = await supabase.auth.getSession();
console.log(data); // Deve ter uma sessão ativa
```

### ❌ Problema: Autor não aparece na página

**Checklist:**
```
☐ Nome do autor corresponde exatamente?
☐ Autor está com "Publicado" = true?
☐ Nome do autor no artigo está digitado corretamente?
☐ Página foi recarregada?
```

**Solução:**
```javascript
// No console da página do artigo:
console.log('Post autor:', post.autor); // Ex: "João Silva"
console.log('Buscado por:', formData.autor); // Deve ser igual
```

### ❌ Problema: Imagem não salva

**Checklist:**
```
☐ Formato correto? (PNG, JPG, JPEG)
☐ Tamanho ok? (< 5MB)
☐ Permissão no navegador?
```

**Solução:**
```javascript
// Teste upload manual:
const file = document.querySelector('input[type="file"]').files[0];
const reader = new FileReader();
reader.onload = (e) => console.log(e.target.result);
reader.readAsDataURL(file);
```

---

## 📊 Teste de Performance

### Teste: Carregar 100 autores
```javascript
// Script para criar 100 autores de teste
for (let i = 1; i <= 100; i++) {
  await supabase.from('autores').insert([{
    nome: `Autor ${i}`,
    cargo: `Profissão ${i}`,
    bio: `Bio do autor ${i}`,
    email: `autor${i}@teste.com`,
    publicado: true
  }]);
}

// Esperado:
// - Dropdown carrega em < 2s
// - Lista em /admin/autores carrega em < 3s
// - Sem memory leak
```

---

## 🧩 Teste de Integração com Outros Componentes

### Com AdminBlog
```javascript
// ✓ Dropdown carrega quando página abre
// ✓ Seleção persiste durante edição
// ✓ Valor salvo corretamente no banco
// ✓ Ao editar artigo, dropdown tem valor pré-selecionado
```

### Com BlogPost
```javascript
// ✓ Autor buscado por nome
// ✓ Dados do autor exibidos
// ✓ Email clicável
// ✓ Foto responsiva
```

### Com Admin Dashboard
```javascript
// ✓ Card "Autores" visível
// ✓ Link funciona
// ✓ Acesso protegido (sem login não acessa)
```

---

## 🚨 Teste de Casos Extremos

### Caso 1: Autor com Bio muito longa
```javascript
bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
     "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
     "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris";

// Esperado: Texto truncado ou com scroll em mobile
```

### Caso 2: Email inválido
```javascript
email: "email_invalido"

// Esperado: Mensagem de erro ou validação no input
```

### Caso 3: Imagem muito grande
```javascript
// Imagem 10MB+

// Esperado: 
// - Erro no console
// - Toast de erro
// - Não salva
```

### Caso 4: Nome com caracteres especiais
```javascript
nome: "João da Silva Côté-2º"

// Esperado: Salva normalmente
```

### Caso 5: Múltiplos uploads simultâneos
```javascript
// Crie 5 autores em sequência rápida

// Esperado:
// - Todos são criados
// - Lista atualiza corretamente
// - Sem conflitos
```

---

## ✅ Teste de Responsividade

```javascript
// Desktop (1920x1080)
// ✓ 2 colunas: Formulário + Lista

// Tablet (768x1024)
// ✓ 1 coluna: Formulário em cima, Lista embaixo

// Mobile (375x667)
// ✓ 1 coluna
// ✓ Botões acessíveis
// ✓ Inputs grandes o suficiente
// ✓ Imagem visualizável
```

---

## 🔐 Teste de Segurança

```javascript
// 1. Sem autenticação
// ✓ Não pode acessar /admin/autores
// ✓ Redirecionado para /login

// 2. Sem permissão
// ✓ Não pode excluir autores de outros usuários (se implementado)

// 3. SQL Injection
nome: "'; DROP TABLE autores; --"
// ✓ Salvo como texto literal, não executado

// 4. XSS
bio: "<script>alert('XSS')</script>"
// ✓ Renderizado como texto, não executado

// 5. CORS
// ✓ Supabase CORS configurado corretamente
// ✓ Requisições funcionam de http://localhost:5173
```

---

## 📈 Teste de Escalabilidade

```javascript
// Cenário: 1000 autores + 10000 artigos

// Esperado:
// ✓ Dropdown carrega em < 2s
// ✓ Busca de autor por nome é rápida
// ✓ Página do artigo carrega rápido
// ✓ Sem freeze da UI
```

---

## 🎉 Teste de Sucesso

Se todos os testes passarem, seu sistema está 100% funcional:

```
✅ Banco de dados criado
✅ CRUD de autores funcionando
✅ Integração com blog funcionando
✅ Exibição correta no artigo
✅ Performance aceitável
✅ Sem bugs críticos
✅ Responsivo em todos os devices
✅ Seguro contra vulnerabilidades comuns
```

## 📝 Próximas Ações

```
1. ☐ Documentar na equipe
2. ☐ Deploy em staging
3. ☐ Teste final em produção
4. ☐ Treinar usuários
5. ☐ Monitorar performance
6. ☐ Coletar feedback
7. ☐ Implementar melhorias
```

---

**Pronto para começar o teste!** 🚀

Execute este checklist e relporte qualquer problema nos logs.
