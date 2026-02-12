-- Script para adicionar campos necessários para o sistema de modal de projetos
-- Execute este script no Supabase SQL Editor

-- 1. Adicionar campos para storytelling e tradução na tabela projetos
ALTER TABLE projetos
ADD COLUMN IF NOT EXISTS descricao_longa TEXT,
ADD COLUMN IF NOT EXISTS descricao_longa_en TEXT,
ADD COLUMN IF NOT EXISTS site_url TEXT;

-- Comentários nas colunas para documentação
COMMENT ON COLUMN projetos.descricao_longa IS 'Descrição completa/storytelling do projeto em português';
COMMENT ON COLUMN projetos.descricao_longa_en IS 'Descrição completa/storytelling do projeto em inglês (tradução automática)';
COMMENT ON COLUMN projetos.site_url IS 'URL do site do projeto (quando aplicável)';

-- 2. Criar tabela para galeria de imagens dos projetos
CREATE TABLE IF NOT EXISTS projeto_galeria (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  projeto_id UUID NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  imagem_url TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  legenda TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentários na tabela
COMMENT ON TABLE projeto_galeria IS 'Galeria de imagens para cada projeto (10-15 imagens)';
COMMENT ON COLUMN projeto_galeria.projeto_id IS 'Referência ao projeto';
COMMENT ON COLUMN projeto_galeria.imagem_url IS 'URL da imagem hospedada no Supabase Storage';
COMMENT ON COLUMN projeto_galeria.ordem IS 'Ordem de exibição das imagens na galeria';
COMMENT ON COLUMN projeto_galeria.legenda IS 'Legenda opcional para a imagem';

-- 3. Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_projeto_galeria_projeto_ordem 
ON projeto_galeria(projeto_id, ordem);

-- 4. Habilitar RLS (Row Level Security)
ALTER TABLE projeto_galeria ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de acesso
-- Permitir leitura pública
CREATE POLICY "Permitir leitura pública de galeria de projetos"
ON projeto_galeria FOR SELECT
TO public
USING (true);

-- Permitir apenas usuários autenticados a inserir
CREATE POLICY "Permitir usuários autenticados a inserir imagens"
ON projeto_galeria FOR INSERT
TO authenticated
WITH CHECK (true);

-- Permitir apenas usuários autenticados a atualizar
CREATE POLICY "Permitir usuários autenticados a atualizar imagens"
ON projeto_galeria FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Permitir apenas usuários autenticados a deletar
CREATE POLICY "Permitir usuários autenticados a deletar imagens"
ON projeto_galeria FOR DELETE
TO authenticated
USING (true);

-- 6. Criar bucket no Storage para imagens de galeria (execute no painel do Supabase Storage)
-- Nome do bucket: projeto-galeria
-- Público: Sim
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
-- Max file size: 5MB

-- 7. Política de storage para o bucket projeto-galeria
-- Execute no SQL Editor após criar o bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('projeto-galeria', 'projeto-galeria', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Acesso público para leitura de galeria" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar" ON storage.objects;

-- Permitir leitura pública das imagens
CREATE POLICY "Acesso público para leitura de galeria"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'projeto-galeria');

-- Permitir upload apenas para usuários autenticados
CREATE POLICY "Usuários autenticados podem fazer upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'projeto-galeria');

-- Permitir exclusão apenas para usuários autenticados
CREATE POLICY "Usuários autenticados podem deletar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'projeto-galeria');
