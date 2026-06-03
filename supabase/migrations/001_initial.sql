-- MemoriAI — Schema inicial
-- Executar no Supabase SQL Editor

-- Tabela: pages
create table if not exists pages (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text unique not null,
  user_id              uuid references auth.users on delete set null,
  status               text not null default 'draft',

  -- Dados do casal
  nome_pessoa1         text not null,
  nome_pessoa2         text not null,
  data_inicio          date not null,

  -- Conteúdo gerado por IA
  narrativa_ia         text,

  -- Configurações visuais
  tema                 text not null default 'classico',
  musica_url           text,

  -- Mural colaborativo
  colaboracao_ativa    boolean not null default false,
  colaboracao_token    text unique,
  colaboracao_prazo    timestamptz,

  -- Pagamento
  payment_id           text,
  paid_at              timestamptz,
  email_criador        text,

  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- Tabela: momentos
create table if not exists momentos (
  id          uuid primary key default gen_random_uuid(),
  page_id     uuid not null references pages(id) on delete cascade,
  titulo      text not null,
  descricao   text,
  data        date,
  foto_url    text,
  ordem       int not null default 0,
  created_at  timestamptz not null default now()
);

-- Tabela: contribuicoes
create table if not exists contribuicoes (
  id          uuid primary key default gen_random_uuid(),
  page_id     uuid not null references pages(id) on delete cascade,
  nome_autor  text not null,
  mensagem    text not null,
  foto_url    text,
  aprovada    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Tabela: respostas
create table if not exists respostas (
  id          uuid primary key default gen_random_uuid(),
  page_id     uuid not null references pages(id) on delete cascade,
  mensagem    text not null,
  foto_url    text,
  created_at  timestamptz not null default now()
);

-- Índices
create index if not exists idx_pages_slug on pages(slug);
create index if not exists idx_pages_user_id on pages(user_id);
create index if not exists idx_pages_status on pages(status);
create index if not exists idx_pages_colaboracao_token on pages(colaboracao_token);
create index if not exists idx_momentos_page_id on momentos(page_id);
create index if not exists idx_contribuicoes_page_id on contribuicoes(page_id);
create index if not exists idx_respostas_page_id on respostas(page_id);

-- RLS — Row Level Security

alter table pages enable row level security;
alter table momentos enable row level security;
alter table contribuicoes enable row level security;
alter table respostas enable row level security;

-- Policies: pages
create policy "Leitura pública de páginas ativas"
  on pages for select
  using (status = 'active');

create policy "Dono gerencia sua página"
  on pages for all
  using (auth.uid() = user_id);

-- Inserção sem auth (durante criação)
create policy "Inserção de draft"
  on pages for insert
  with check (status = 'draft');

-- Policies: momentos
create policy "Leitura de momentos de páginas ativas"
  on momentos for select
  using (
    exists (
      select 1 from pages p
      where p.id = momentos.page_id
      and p.status = 'active'
    )
  );

create policy "Dono gerencia momentos"
  on momentos for all
  using (
    exists (
      select 1 from pages p
      where p.id = momentos.page_id
      and p.user_id = auth.uid()
    )
  );

create policy "Inserção de momentos em draft"
  on momentos for insert
  with check (
    exists (
      select 1 from pages p
      where p.id = momentos.page_id
      and (p.status = 'draft' or p.user_id = auth.uid())
    )
  );

-- Policies: contribuicoes
create policy "Leitura de contribuições aprovadas"
  on contribuicoes for select
  using (aprovada = true);

create policy "Qualquer um contribui"
  on contribuicoes for insert
  with check (true);

create policy "Dono aprova contribuições"
  on contribuicoes for update
  using (
    exists (
      select 1 from pages p
      where p.id = contribuicoes.page_id
      and p.user_id = auth.uid()
    )
  );

-- Policies: respostas
create policy "Respostas públicas"
  on respostas for select
  using (true);

create policy "Qualquer um responde"
  on respostas for insert
  with check (true);

-- Storage Buckets
insert into storage.buckets (id, name, public)
values
  ('fotos-momentos', 'fotos-momentos', true),
  ('fotos-contribuicoes', 'fotos-contribuicoes', false)
on conflict (id) do nothing;

-- Storage policies
create policy "Leitura pública fotos-momentos"
  on storage.objects for select
  using (bucket_id = 'fotos-momentos');

create policy "Upload fotos-momentos"
  on storage.objects for insert
  with check (bucket_id = 'fotos-momentos');

create policy "Leitura fotos-contribuicoes autenticado"
  on storage.objects for select
  using (
    bucket_id = 'fotos-contribuicoes'
    and auth.role() = 'authenticated'
  );

create policy "Upload fotos-contribuicoes"
  on storage.objects for insert
  with check (bucket_id = 'fotos-contribuicoes');

-- Trigger para atualizar updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger pages_updated_at
  before update on pages
  for each row
  execute function update_updated_at();
