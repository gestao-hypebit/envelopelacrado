-- Distingue momentos da timeline (polaroids) de fotos da galeria
ALTER TABLE momentos
  ADD COLUMN IF NOT EXISTS tipo text NOT NULL DEFAULT 'momento';

-- Index para queries filtradas por tipo
CREATE INDEX IF NOT EXISTS momentos_tipo_idx ON momentos (page_id, tipo);
