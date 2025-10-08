

set check_function_bodies = off;

create extension if not exists "pgcrypto";

create schema if not exists public;

create or replace function public.current_profile_role() returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid();
$$;

create or replace function public.is_admin() returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(role = 'admin', false)
  from public.profiles
  where id = auth.uid();
$$;

create or replace function public.is_agent() returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(role = 'agente', false)
  from public.profiles
  where id = auth.uid();
$$;

create or replace function public.is_partner() returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(role = 'partner', false)
  from public.profiles
  where id = auth.uid();
$$;

grant execute on function public.current_profile_role() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_agent() to authenticated;
grant execute on function public.is_partner() to authenticated;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'cliente' check (role in ('cliente','agente','partner','admin')),
  full_name text,
  phone text,
  province text,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;

create policy "profiles_self_access" on public.profiles
  for all using (
    auth.uid() = id or public.is_admin()
  )
  with check (
    auth.uid() = id or public.is_admin()
  );

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  firm_name text not null,
  specialties text[] not null default '{}',
  verified boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists partners_user_idx on public.partners(user_id);

alter table public.partners enable row level security;

create policy "partners_self_access" on public.partners
  for select using (auth.uid() = user_id or public.is_admin());

create policy "partners_admin_write" on public.partners
  for all using (public.is_admin())
  with check (public.is_admin());


create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null,
  mime text not null,
  sha256 text not null unique,
  source text not null check (source in ('upload','email')),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists documents_user_idx on public.documents(user_id);
create index if not exists documents_created_idx on public.documents(created_at desc);

alter table public.documents enable row level security;

create policy "documents_owner_and_team" on public.documents
  for select using (
    auth.uid() = user_id
    or public.is_admin()
    or exists (
      select 1
      from public.requests r
      where r.document_id = documents.id
        and (
          r.user_id = auth.uid()
          or r.agent_id = auth.uid()
          or exists (
            select 1
            from public.partners p
            where p.id = r.partner_id
              and p.user_id = auth.uid()
          )
        )
    )
  );

create policy "documents_insert_owner" on public.documents
  for insert with check (auth.uid() = user_id or public.is_admin());

create policy "documents_update_owner" on public.documents
  for update using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  agent_id uuid references public.profiles(id),
  partner_id uuid references public.partners(id),
  status text not null default 'new' check (
    status in ('new','processing','needs_review','ready','delivered','rejected','archived')
  ),
  priority integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists requests_user_idx on public.requests(user_id);
create index if not exists requests_agent_idx on public.requests(agent_id);
create index if not exists requests_partner_idx on public.requests(partner_id);

alter table public.requests enable row level security;

create policy "requests_owner_agent_partner" on public.requests
  for select using (
    auth.uid() = user_id
    or public.is_admin()
    or agent_id = auth.uid()
    or exists (
      select 1 from public.partners p
      where p.id = requests.partner_id
        and p.user_id = auth.uid()
    )
  );

create policy "requests_insert_owner" on public.requests
  for insert with check (auth.uid() = user_id or public.is_admin());

create policy "requests_update_team" on public.requests
  for update using (
    auth.uid() = user_id
    or public.is_admin()
    or agent_id = auth.uid()
  )
  with check (
    auth.uid() = user_id
    or public.is_admin()
    or agent_id = auth.uid()
  );

create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  ai_summary text,
  ai_flags jsonb,
  human_review boolean not null default false,
  reviewer_id uuid references public.profiles(id),
  final_report_url text,
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists analyses_request_unique on public.analyses(request_id);

alter table public.analyses enable row level security;

create policy "analyses_linked_request" on public.analyses
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.requests r
      where r.id = analyses.request_id
        and (
          r.user_id = auth.uid()
          or r.agent_id = auth.uid()
          or exists (
            select 1 from public.partners p
            where p.id = r.partner_id
              and p.user_id = auth.uid()
          )
        )
    )
  );

create policy "analyses_update_reviewers" on public.analyses
  for update using (public.is_admin() or public.is_agent())
  with check (public.is_admin() or public.is_agent());

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  stripe_pi text,
  amount_cents integer not null,
  currency text not null default 'EUR',
  status text not null check (status in ('requires_payment','paid','refunded','failed')),
  purpose text not null check (purpose in ('initial_service','follow_up_qa')),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists payments_request_idx on public.payments(request_id);

alter table public.payments enable row level security;

create policy "payments_owner_admin" on public.payments
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.requests r
      where r.id = payments.request_id
        and (
          r.user_id = auth.uid()
          or r.agent_id = auth.uid()
          or exists (
            select 1 from public.partners p
            where p.id = r.partner_id
              and p.user_id = auth.uid()
          )
        )
    )
  );

create table if not exists public.pricing_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  kind text not null check (kind in ('unit','pack')),
  docs_included integer,
  stripe_product_id text,
  stripe_price_id text,
  currency text not null default 'EUR',
  amount_cents integer not null,
  active boolean not null default true,
  visible boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.pricing_plans enable row level security;

create policy "pricing_plans_public_read" on public.pricing_plans
  for select using (true);

create policy "pricing_plans_admin_write" on public.pricing_plans
  for all using (public.is_admin())
  with check (public.is_admin());

create table if not exists public.pricing_addons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  stripe_product_id text,
  stripe_price_id text,
  currency text not null default 'EUR',
  amount_cents integer not null,
  active boolean not null default true,
  visible boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.pricing_addons enable row level security;

create policy "pricing_addons_public_read" on public.pricing_addons
  for select using (true);

create policy "pricing_addons_admin_write" on public.pricing_addons
  for all using (public.is_admin())
  with check (public.is_admin());

create table if not exists public.purchase_items (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete cascade,
  item_type text not null check (item_type in ('plan','addon')),
  item_id uuid not null,
  quantity integer not null default 1,
  metadata jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists purchase_items_payment_idx on public.purchase_items(payment_id);

alter table public.purchase_items enable row level security;

create policy "purchase_items_payment_scope" on public.purchase_items
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.payments pay
      join public.requests r on r.id = pay.request_id
      where pay.id = purchase_items.payment_id
        and (
          r.user_id = auth.uid()
          or r.agent_id = auth.uid()
          or exists (
            select 1 from public.partners p
            where p.id = r.partner_id
              and p.user_id = auth.uid()
          )
        )
    )
  );

create table if not exists public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  specialties text[] not null default '{}',
  province text,
  notes text,
  status text not null default 'received' check (status in ('received','screening','approved','rejected')),
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.partner_applications enable row level security;

create policy "partner_applications_admin_only" on public.partner_applications
  for all using (public.is_admin())
  with check (public.is_admin());

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'received' check (status in ('received','replied','closed')),
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.contact_messages enable row level security;

create policy "contact_messages_admin_only" on public.contact_messages
  for all using (public.is_admin())
  with check (public.is_admin());

create table if not exists public.webhooks (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_type text not null,
  payload jsonb not null,
  received_at timestamptz not null default timezone('utc', now())
);

alter table public.webhooks enable row level security;

create policy "webhooks_admin" on public.webhooks
  for all using (public.is_admin())
  with check (public.is_admin());

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity text not null,
  entity_id uuid,\n  metadata jsonb,
  at timestamptz not null default timezone('utc', now())
);

alter table public.audit_logs enable row level security;

create policy "audit_logs_admin" on public.audit_logs
  for select using (public.is_admin());

create table if not exists public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  scope text not null,
  granted_at timestamptz not null default timezone('utc', now())
);

create index if not exists consents_user_idx on public.consents(user_id);

alter table public.consents enable row level security;

create policy "consents_owner_admin" on public.consents
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

insert into storage.buckets (id, name, public)
values
  ('uploads', 'uploads', false),
  ('reports', 'reports', false),
  ('public-branding', 'public-branding', true)
on conflict (id) do nothing;

alter table storage.objects enable row level security;

create policy "storage_uploads_owner" on storage.objects
  for select using (
    bucket_id = 'uploads'
    and (
      (auth.uid() = owner)
      or public.is_admin()
    )
  );

create policy "storage_uploads_insert" on storage.objects
  for insert with check (
    bucket_id = 'uploads' and (auth.uid() = owner or public.is_admin())
  );

create policy "storage_reports_access" on storage.objects
  for select using (
    bucket_id = 'reports'
    and (
      public.is_admin()
      or exists (
        select 1 from public.requests r
        join public.analyses a on a.request_id = r.id
        where a.final_report_url ilike '%' || storage.objects.name
          and (
            r.user_id = auth.uid()
            or r.agent_id = auth.uid()
            or exists (
              select 1 from public.partners p
              where p.id = r.partner_id
                and p.user_id = auth.uid()
            )
          )
      )
    )
  );

create policy "storage_branding_public" on storage.objects
  for select using (bucket_id = 'public-branding');





