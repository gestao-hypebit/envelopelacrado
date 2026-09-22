-- Contador de gerações de narrativa antes do pagamento (rate limit real).
-- O client (components/criar/PreviewPage.tsx) já trata HTTP 429 pra isso,
-- mas o servidor nunca aplicava nenhum limite — qualquer um podia chamar
-- /api/gerar-narrativa livremente com o mesmo pageId e gastar API do Claude
-- à vontade antes de pagar.
alter table pages
  add column if not exists narrativa_geracoes int not null default 0;
