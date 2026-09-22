-- A policy "Leitura pública de páginas ativas" (using status = 'active') libera SELECT
-- de TODAS as colunas de `pages` para a role `anon` — inclusive email_criador,
-- colaboracao_token e payment_id. Como a anon key é pública (embutida no site),
-- qualquer pessoa pode consultar a REST API do Supabase direto e ler esses dados
-- de qualquer página ativa, sem passar pelo Next.js.
--
-- RLS é só filtro de linha; pra restringir coluna é preciso GRANT coluna a coluna.
-- Rotas que precisam de acesso total (dashboard, ativação, webhook etc.) usam a
-- service_role key, que ignora RLS e GRANT — não são afetadas por esta migration.

revoke select on pages from anon;

grant select (
  id,
  slug,
  status,
  nome_pessoa1,
  nome_pessoa2,
  data_inicio,
  narrativa_ia,
  tema,
  musica_url
) on pages to anon;
