-- Script para criar a estrutura de Autores no Supabase
-- Execute este script no Supabase SQL Editor

-- Criar tabela de autores
CREATE TABLE IF NOT EXISTS autores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  foto_url TEXT,
  bio TEXT,
  email TEXT,
  publicado BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_autores_nome ON autores(nome);
CREATE INDEX IF NOT EXISTS idx_autores_publicado ON autores(publicado) WHERE publicado = true;

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_autores_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_autores_updated_at ON autores;
CREATE TRIGGER update_autores_updated_at
  BEFORE UPDATE ON autores
  FOR EACH ROW
  EXECUTE FUNCTION update_autores_updated_at_column();

-- Adicionar comentários para documentação
COMMENT ON TABLE autores IS 'Tabela de autores dos artigos do blog';
COMMENT ON COLUMN autores.nome IS 'Nome completo do autor';
COMMENT ON COLUMN autores.cargo IS 'Cargo/Profissão do autor';
COMMENT ON COLUMN autores.foto_url IS 'URL da foto de perfil do autor';
COMMENT ON COLUMN autores.bio IS 'Biografia breve do autor';
COMMENT ON COLUMN autores.email IS 'Email do autor (opcional)';
COMMENT ON COLUMN autores.publicado IS 'Indica se o autor está disponível para uso nos artigos';

-- Adicionar coluna autor_id na tabela posts (se desejar relacionamento mais forte)
-- Descomente as linhas abaixo se quiser fazer esse relacionamento:
/*
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS autor_id UUID,
ADD CONSTRAINT fk_posts_autor FOREIGN KEY (autor_id) REFERENCES autores(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_posts_autor_id ON posts(autor_id);
*/
