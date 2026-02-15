# Relatório de Implementação — CRM Lite no Painel Admin

## 1) Contexto atual do projeto

O projeto já possui uma base técnica muito favorável para incluir um CRM Lite:

- Frontend em React com rotas protegidas para admin.
- Backend próprio em Node/Express.
- Persistência em MongoDB Atlas via Mongoose.
- Autenticação administrativa com JWT.
- Upload de arquivos já implementado (coleção `uploads`).
- Camada cliente no frontend (`src/lib/supabase.js`) funcionando como adaptador para API própria.

### Observação importante de arquitetura

Apesar do nome `supabase`, a implementação atual já conversa com a API própria (Mongo/Express). Ou seja, não há dependência funcional de Supabase para continuar a evolução do admin.

---

## 2) Objetivo do CRM Lite

Criar um módulo enxuto no painel administrativo para:

1. Cadastrar e gerenciar clientes.
2. Gerar contratos a partir de texto/template jurídico.
3. Controlar pagamentos a receber e vencimentos.
4. Exibir alertas de aniversário e de proximidade de vencimento.

Foco: operação simples, rápida e centralizada no seu próprio admin.

---

## 3) Escopo recomendado (MVP)

### Módulo Clientes

- Cadastro: nome, e-mail, telefone, documento, empresa, data de aniversário, observações.
- Status: ativo/inativo.
- Listagem com busca por nome e filtro por status.

### Módulo Pagamentos

- Registro de cobrança: cliente, descrição, valor, vencimento, status (`pendente`, `pago`, `atrasado`).
- Ações: marcar como pago e registrar data de pagamento.
- Visões rápidas: vencendo em 7 dias, vencido, pagos no mês.

### Módulo Contratos (versão 1)

- Cadastro de template jurídico (texto fornecido pelo advogado).
- Preenchimento de variáveis (ex.: `{{cliente_nome}}`, `{{valor}}`, `{{prazo}}`).
- Geração de versão final em HTML/PDF para download e histórico.

### Alertas no admin

- Painel “Hoje” com:
  - aniversariantes do dia;
  - cobranças em D-7, D-3, D-1;
  - cobranças vencidas não pagas.

---

## 4) Modelagem de dados sugerida (MongoDB)

## `clientes`

- `nome` (string, obrigatório)
- `email` (string)
- `telefone` (string)
- `documento` (string)
- `empresa` (string)
- `data_aniversario` (string `YYYY-MM-DD`)
- `status` (string: `ativo` | `inativo`)
- `observacoes` (string)
- `created_at`, `updated_at`

## `contratos`

- `cliente_id` (ObjectId/string)
- `titulo` (string)
- `template_nome` (string)
- `template_conteudo` (string)
- `variaveis` (objeto)
- `conteudo_renderizado` (string)
- `pdf_url` (string)
- `status` (string: `rascunho` | `emitido` | `assinado`)
- `created_at`, `updated_at`

## `pagamentos`

- `cliente_id` (ObjectId/string)
- `descricao` (string)
- `valor` (number)
- `vencimento` (string `YYYY-MM-DD`)
- `status` (string: `pendente` | `pago` | `atrasado`)
- `data_pagamento` (string `YYYY-MM-DD`)
- `observacoes` (string)
- `created_at`, `updated_at`

## `notificacoes` (opcional para fila/histórico)

- `tipo` (string: `aniversario` | `vencimento`)
- `referencia_id` (string)
- `canal` (string: `painel` | `email`)
- `scheduled_for` (date)
- `sent_at` (date)
- `status` (string)

---

## 5) Ajustes técnicos necessários na base atual

1. Expandir backend para novos modelos Mongoose (`clientes`, `contratos`, `pagamentos`, opcional `notificacoes`).
2. Incluir essas coleções no `allowedTables` e `tableModelMap` da API de query.
3. Adicionar rotas especializadas para contrato/PDF (fora do CRUD genérico).
4. Criar novas páginas admin:
   - `/admin/clientes`
   - `/admin/pagamentos`
   - `/admin/contratos`
5. Adicionar cards no dashboard admin para os novos módulos.

---

## 6) Estratégia de implementação por fases

### Fase 1 — Base de CRM (rápida)

- Clientes + Pagamentos + alertas visuais no painel.
- Sem automação externa (somente painel).

**Resultado:** já resolve cadastro, controle e acompanhamento diário.

### Fase 2 — Contratos

- Templates + preenchimento de variáveis + exportação PDF.
- Histórico de documentos gerados por cliente.

**Resultado:** operação comercial mais padronizada e profissional.

### Fase 3 — Automações

- Job diário no backend para consolidar lembretes.
- Envio opcional de e-mail/WhatsApp (se desejar).

**Resultado:** redução de esquecimentos e rotina mais previsível.

---

## 7) Estimativa de esforço (ordem de grandeza)

- Fase 1: 3 a 5 dias úteis.
- Fase 2: 2 a 4 dias úteis.
- Fase 3: 1 a 3 dias úteis.

Total MVP completo: aproximadamente 1 a 2 semanas úteis (dependendo de refinos de UX e regras contratuais).

---

## 8) Riscos e cuidados

- Segurança jurídica: contratos exigem versionamento de template e trilha de quem gerou.
- Privacidade/LGPD: armazenar apenas dados necessários e proteger dados pessoais.
- Datas: manter padrão `YYYY-MM-DD` para evitar problemas de fuso em vencimentos/aniversários.
- Evolução: a API genérica acelera MVP, mas regras críticas (contrato/financeiro) pedem endpoints dedicados.

---

## 9) Recomendações práticas para este projeto

1. Manter o nome do adaptador `supabase` temporariamente para não quebrar telas existentes.
2. Após CRM entrar em produção, renomear para algo neutro (`apiClient`) em refatoração controlada.
3. Criar primeiro o valor operacional (Clientes + Pagamentos + Alertas) antes de automações.
4. Só depois adicionar assinatura eletrônica ou integrações externas (se realmente necessário).

---

## 10) Próximo passo recomendado

Iniciar imediatamente a Fase 1 com:

- modelagem das coleções de CRM no backend,
- rotas/queries habilitadas,
- telas admin de clientes e pagamentos,
- widget de alertas no dashboard.

Isso entrega utilidade real em poucos dias, com baixa complexidade e alinhado à arquitetura que vocês já têm hoje.
