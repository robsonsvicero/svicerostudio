# Gerenciamento de Autores - Guia de Uso

## 📋 Visão Geral

O sistema de Autores foi criado para gerenciar os profissionais que escrevem os artigos do blog. Cada autor possui:
- **Foto/Imagem** (base64)
- **Nome** (obrigatório)
- **Cargo** (obrigatório) - Exemplo: Designer, Desenvolvedor, Especialista em Marketing
- **Bio** (opcional) - Descrição breve do autor
- **Email** (opcional)
- **Status de Publicação** - Define se o autor está disponível para uso nos artigos

## 🗄️ Banco de Dados

### 1. Criar a Tabela no Supabase

Execute o script SQL em `CREATE_AUTORES_TABLE.sql` no editor SQL do Supabase:

1. Acesse seu dashboard do Supabase
2. Vá para SQL Editor
3. Copie todo o conteúdo do arquivo `CREATE_AUTORES_TABLE.sql`
4. Execute o script

**Estrutura da Tabela `autores`:**
- `id` (UUID) - Identificador único
- `nome` (TEXT) - Nome completo do autor
- `cargo` (TEXT) - Cargo/Profissão
- `foto_url` (TEXT) - URL da foto em base64
- `bio` (TEXT) - Biografia breve
- `email` (TEXT) - Email do autor
- `publicado` (BOOLEAN) - Status de publicação
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

## 📝 Como Usar

### Acessar o Painel de Autores

1. Faça login em `/login`
2. Acesse o Painel Administrativo (`/admin`)
3. Clique no card "Autores" ou acesse diretamente `/admin/autores`

### Criar um Novo Autor

1. No formulário "Novo Autor", preencha os campos:
   - **Foto**: Selecione uma imagem (JPEG, PNG) ou cole com Ctrl+V
   - **Nome**: Insira o nome completo (obrigatório)
   - **Cargo**: Insira o cargo/profissão (obrigatório)
   - **Email**: (Opcional) Email do autor
   - **Bio**: (Opcional) Descrição breve (até 500 caracteres recomendado)
   - **Publicado**: Marque para tornar o autor disponível

2. Clique em "Criar"

### Editar um Autor

1. Localize o autor na lista
2. Clique no botão "Editar"
3. Modifique os campos desejados
4. Clique em "Atualizar"

### Excluir um Autor

1. Localize o autor na lista
2. Clique no botão "Excluir"
3. Confirme a exclusão

⚠️ **Atenção**: Ao excluir um autor, os artigos que usam esse autor não sofrerão alterações, mas a referência será mantida pelo nome. Considere desmarcar "Publicado" em vez de excluir.

## 📰 Usando Autores nos Artigos

### No Painel de Blog (`/admin/blog`)

1. Ao criar ou editar um artigo, na seção "Autor":
   - Um dropdown será exibido com todos os autores publicados
   - Selecione o autor desejado
   - Se nenhum autor estiver disponível, você verá um aviso com link para criar um

2. O campo "Autor" agora será preenchido automaticamente com o nome do autor selecionado

### Na Página do Artigo

Quando um artigo é visualizado em `/blog/:slug`:

1. Abaixo do conteúdo, será exibido um card "Sobre o Autor" com:
   - Foto do autor
   - Nome completo
   - Cargo/Profissão
   - Bio (se preenchida)
   - Link para enviar email (se email foi preenchido)

**Exemplo de exibição:**
```
┌─────────────────────────────────────┐
│ Sobre o Autor                        │
│                                     │
│ [FOTO]  João Silva                  │
│         Designer UX/UI               │
│         "Apaixonado por design..."   │
│         📧 joao@exemplo.com          │
└─────────────────────────────────────┘
```

## 🎯 Fluxo de Uso Recomendado

1. **Primeiro**: Crie todos os autores em `/admin/autores`
2. **Depois**: Crie os artigos em `/admin/blog` selecionando os autores
3. **Resultado**: Cada artigo publicado exibirá automaticamente as informações do autor

## 💡 Dicas Importantes

### Imagens
- **Formato**: PNG, JPG, JPEG
- **Tamanho recomendado**: 200x200 a 500x500 pixels
- **Método de upload**: Selecione ou cole com Ctrl+V
- **Armazenamento**: As imagens são convertidas para base64 e salvas no banco de dados

### Validações
- Nome e Cargo são **obrigatórios**
- Apenas autores com status "Publicado" aparecem no dropdown de artigos
- Email deve ser um endereço válido (formato validado automaticamente)

### Performance
- Autores publicados são carregados automaticamente ao abrir `/admin/blog`
- A busca de autor na página de artigo é feita pelo nome
- Índices de banco de dados otimizam as queries

## 🔄 Relacionamento com Artigos

Atualmente, o campo `autor` nos posts é um texto simples (nome do autor). Existe a opção de criar um relacionamento mais forte:

### Opção Avançada: Usar IDs (Descomentado no SQL)

Se quiser fazer um relacionamento por ID em vez de nome:

1. Descomente as linhas ao final do arquivo `CREATE_AUTORES_TABLE.sql`
2. Execute novamente o script no Supabase
3. Isso criará:
   - Coluna `autor_id` na tabela `posts`
   - Foreign key constraint
   - Índice para performance

**Vantagens**:
- Integridade referencial garantida
- Atualizações automáticas se mudar nome do autor
- Queries mais eficientes

**Para implementar essa mudança no código**:
- Atualize `AdminBlog.jsx` para salvar `autor_id` em vez de `autor`
- Atualize `BlogPost.jsx` para buscar por `autor_id`

## 📊 Estrutura de Campos no Formulário

```
┌────────────────────────────────────┐
│ NOVO AUTOR / EDITAR AUTOR           │
├────────────────────────────────────┤
│ Foto do Autor                       │
│ [Preview da Imagem]                 │
│ [Input File]                        │
├────────────────────────────────────┤
│ Nome *                              │
│ [Input Text]                        │
├────────────────────────────────────┤
│ Cargo *                             │
│ [Input Text]                        │
├────────────────────────────────────┤
│ Email                               │
│ [Input Email]                       │
├────────────────────────────────────┤
│ Bio                                 │
│ [Textarea]                          │
├────────────────────────────────────┤
│ ☑ Publicado                         │
├────────────────────────────────────┤
│ [Criar/Atualizar]  [Cancelar]       │
└────────────────────────────────────┘
```

## 🐛 Troubleshooting

### Dropdown vazio em `/admin/blog`
- Verifique se criou autores em `/admin/autores`
- Certifique-se de que os autores estão com status "Publicado"
- Recarregue a página

### Autor não aparece na página do artigo
- Verifique se o nome do autor no artigo corresponde exatamente ao nome cadastrado
- Nomes são case-sensitive na busca
- O autor precisa estar com status "Publicado"

### Erro ao fazer upload de imagem
- Verifique o tamanho da imagem (máximo recomendado: 5MB)
- Teste com um formato diferente (PNG em vez de JPG)
- Limpe o cache do navegador

## 📞 Suporte

Se encontrar problemas:
1. Verifique o console do navegador (F12) para mensagens de erro
2. Verifique os logs do Supabase
3. Recarregue a página (`F5` ou `Ctrl+Shift+R`)
4. Limpe o cache do navegador
