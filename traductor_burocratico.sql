create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('cliente','agente','partner','admin')),
  full_name text,
  phone text,
  province text,
  avatar_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create unique index if not exists profiles_phone_unique on public.profiles(phone) where phone is not null;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists(
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  firm_name text not null,
  specialties text[] not null default '{}'::text[],
  serving_provinces text[] not null default '{}'::text[],
  website text,
  contact_email text,
  contact_phone text,
  verified boolean not null default false,
  rating numeric(3,2),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists partners_verified_idx on public.partners(verified);

create trigger set_partners_updated_at
before update on public.partners
for each row execute function public.set_updated_at();

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null,
  mime text not null,
  sha256 text not null unique,
  source text not null check (source in ('upload','email','partner')),
  original_filename text,
  file_size_bytes bigint check (file_size_bytes is null or file_size_bytes >= 0),
  page_count integer check (page_count is null or page_count >= 0),
  language text,
  metadata jsonb not null default '{}'::jsonb,
  text_checksum text,
  text_excerpt text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists documents_user_idx on public.documents(user_id);
create index if not exists documents_created_idx on public.documents(created_at desc);

create trigger set_documents_updated_at
before update on public.documents
for each row execute function public.set_updated_at();

create table public.requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  agent_id uuid references public.profiles(id) on delete set null,
  partner_id uuid references public.partners(id) on delete set null,
  status text not null check (status in ('new','processing','needs_review','ready','delivered','rejected','archived')),
  priority integer not null default 0,
  billing_status text not null default 'requires_payment' check (billing_status in ('requires_payment','paid','refunded','failed')),
  billing_total_cents integer not null default 0 check (billing_total_cents >= 0),
  billing_currency text not null default 'EUR',
  partner_share_allowed boolean not null default false,
  document_topic text,
  document_tags text[] not null default '{}'::text[],
  client_notes text,
  internal_notes text,
  summary_snapshot jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  sla_due_at timestamptz,
  deadline_at timestamptz,
  delivered_at timestamptz,
  latest_translation_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists requests_user_idx on public.requests(user_id);
create index if not exists requests_agent_idx on public.requests(agent_id);
create index if not exists requests_partner_idx on public.requests(partner_id);
create index if not exists requests_status_idx on public.requests(status);
create index if not exists requests_deadline_idx on public.requests(deadline_at);
create index if not exists requests_billing_status_idx on public.requests(billing_status);

create trigger set_requests_updated_at
before update on public.requests
for each row execute function public.set_updated_at();

create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  variant text not null default 'pedagogic' check (variant in ('pedagogic','simplified','checklist','support')),
  ai_summary text,
  ai_flags jsonb not null default '{}'::jsonb,
  human_review boolean not null default false,
  reviewer_id uuid references public.profiles(id) on delete set null,
  final_summary text,
  final_flags jsonb not null default '{}'::jsonb,
  final_report_url text,
  latest_translation_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  delivered_at timestamptz
);

alter table public.analyses
add constraint analyses_request_variant_unique unique (request_id, variant);

create trigger set_analyses_updated_at
before update on public.analyses
for each row execute function public.set_updated_at();

create table public.translations (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  analysis_id uuid references public.analyses(id) on delete set null,
  document_id uuid not null references public.documents(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  source_language text,
  target_language text not null default 'es',
  provider text not null default 'openai',
  model text not null,
  prompt_tokens integer not null default 0 check (prompt_tokens >= 0),
  completion_tokens integer not null default 0 check (completion_tokens >= 0),
  total_tokens integer generated always as (coalesce(prompt_tokens,0) + coalesce(completion_tokens,0)) stored,
  token_cost_currency text not null default 'EUR',
  token_cost_cents integer not null default 0 check (token_cost_cents >= 0),
  estimated_latency_ms integer check (estimated_latency_ms is null or estimated_latency_ms >= 0),
  temperature numeric(4,3) default 1.000,
  top_p numeric(4,3) default 1.000,
  frequency_penalty numeric(4,3) default 0.000,
  presence_penalty numeric(4,3) default 0.000,
  prompt_checksum text,
  response_checksum text,
  prompt_metadata jsonb not null default '{}'::jsonb,
  response jsonb not null default '{}'::jsonb,
  status text not null default 'succeeded' check (status in ('queued','running','succeeded','failed')),
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists translations_request_idx on public.translations(request_id, created_at desc);
create index if not exists translations_document_idx on public.translations(document_id);
create index if not exists translations_created_by_idx on public.translations(created_by);

create trigger set_translations_updated_at
before update on public.translations
for each row execute function public.set_updated_at();

alter table public.requests
  add constraint requests_latest_translation_fk
  foreign key (latest_translation_id) references public.translations(id) on delete set null;

alter table public.analyses
  add constraint analyses_latest_translation_fk
  foreign key (latest_translation_id) references public.translations(id) on delete set null;

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_payment_intent text not null,
  stripe_checkout_session text,
  stripe_invoice_id text,
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'EUR',
  status text not null check (status in ('requires_payment','paid','refunded','failed')),
  purpose text not null check (purpose in ('initial_service','follow_up_qa')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists payments_request_idx on public.payments(request_id);
create index if not exists payments_user_idx on public.payments(user_id);
create index if not exists payments_status_idx on public.payments(status);

create trigger set_payments_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

create table public.pricing_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  kind text not null check (kind in ('unit','pack')),
  docs_included integer check (docs_included is null or docs_included > 0),
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'EUR',
  stripe_product_id text,
  stripe_price_id text,
  active boolean not null default true,
  visible boolean not null default true,
  valid_from timestamptz,
  valid_until timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists pricing_plans_name_idx on public.pricing_plans(lower(name));
create unique index if not exists pricing_plans_product_idx on public.pricing_plans(stripe_product_id) where stripe_product_id is not null;
create unique index if not exists pricing_plans_price_idx on public.pricing_plans(stripe_price_id) where stripe_price_id is not null;

create trigger set_pricing_plans_updated_at
before update on public.pricing_plans
for each row execute function public.set_updated_at();

create table public.pricing_addons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'EUR',
  stripe_product_id text,
  stripe_price_id text,
  active boolean not null default true,
  visible boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists pricing_addons_name_idx on public.pricing_addons(lower(name));
create unique index if not exists pricing_addons_product_idx on public.pricing_addons(stripe_product_id) where stripe_product_id is not null;
create unique index if not exists pricing_addons_price_idx on public.pricing_addons(stripe_price_id) where stripe_price_id is not null;

create trigger set_pricing_addons_updated_at
before update on public.pricing_addons
for each row execute function public.set_updated_at();

create table public.purchase_items (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete cascade,
  item_type text not null check (item_type in ('plan','addon')),
  item_id uuid,
  quantity integer not null default 1 check (quantity > 0),
  amount_cents integer not null check (amount_cents >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists purchase_items_payment_idx on public.purchase_items(payment_id);

create table public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  specialties text[] not null default '{}'::text[],
  province text,
  notes text,
  status text not null default 'received' check (status in ('received','screening','approved','rejected')),
  processed_by uuid references public.profiles(id) on delete set null,
  processed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists partner_applications_status_idx on public.partner_applications(status);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'received' check (status in ('received','replied','closed')),
  handled_by uuid references public.profiles(id) on delete set null,
  handled_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.webhooks (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_type text not null,
  status text not null default 'pending' check (status in ('pending','processed','error')),
  payload jsonb not null,
  response_status integer,
  error_message text,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  actor_role text,
  action text not null,
  entity text not null,
  entity_id uuid,
  request_id uuid references public.requests(id) on delete set null,
  document_id uuid references public.documents(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_entity_idx on public.audit_logs(entity, entity_id);
create index if not exists audit_logs_request_idx on public.audit_logs(request_id);

create table public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  scope text not null check (scope in ('pedagogic_translation','contact','share_with_partner')),
  granted boolean not null default true,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);

create unique index if not exists consents_active_unique on public.consents(user_id, scope) where revoked_at is null;
create index if not exists consents_user_idx on public.consents(user_id);

alter table public.profiles enable row level security;
alter table public.profiles force row level security;

create policy "Profiles: self access" on public.profiles
for select using (auth.uid() = id);

create policy "Profiles: self manage" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Profiles: self insert" on public.profiles
for insert with check (auth.uid() = id);

create policy "Profiles: admin manage" on public.profiles
for all using (public.is_admin()) with check (public.is_admin());

create policy "Profiles: agent sees assigned clients" on public.profiles
for select using (
  exists (
    select 1
    from public.requests r
    where r.user_id = public.profiles.id
      and r.agent_id = auth.uid()
  )
);

create policy "Profiles: agent sees assigned partners" on public.profiles
for select using (
  exists (
    select 1
    from public.requests r
    join public.partners pr on pr.id = r.partner_id
    where pr.user_id = public.profiles.id
      and r.agent_id = auth.uid()
  )
);

create policy "Profiles: partner sees assigned client" on public.profiles
for select using (
  exists (
    select 1
    from public.partners pr
    join public.requests r on r.partner_id = pr.id
    where pr.user_id = auth.uid()
      and r.user_id = public.profiles.id
      and r.partner_share_allowed
      and r.billing_status = 'paid'
  )
);

alter table public.partners enable row level security;
alter table public.partners force row level security;

create policy "Partners: public directory" on public.partners
for select using (
  verified = true
  or public.is_admin()
  or user_id = auth.uid()
  or exists (
    select 1
    from public.requests r
    where r.partner_id = public.partners.id
      and (r.user_id = auth.uid() or r.agent_id = auth.uid())
  )
);

create policy "Partners: self insert" on public.partners
for insert with check (user_id = auth.uid());

create policy "Partners: self update" on public.partners
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Partners: admin manage" on public.partners
for all using (public.is_admin()) with check (public.is_admin());

alter table public.documents enable row level security;
alter table public.documents force row level security;

create policy "Documents: owner read" on public.documents
for select using (user_id = auth.uid());

create policy "Documents: owner write" on public.documents
for insert with check (user_id = auth.uid());

create policy "Documents: owner update" on public.documents
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Documents: owner delete" on public.documents
for delete using (user_id = auth.uid());

create policy "Documents: admin manage" on public.documents
for all using (public.is_admin()) with check (public.is_admin());

create policy "Documents: agent access" on public.documents
for select using (
  exists (
    select 1
    from public.requests r
    where r.document_id = public.documents.id
      and r.agent_id = auth.uid()
  )
);

create policy "Documents: agent update metadata" on public.documents
for update using (
  exists (
    select 1
    from public.requests r
    where r.document_id = public.documents.id
      and r.agent_id = auth.uid()
  )
) with check (
  exists (
    select 1
    from public.requests r
    where r.document_id = public.documents.id
      and r.agent_id = auth.uid()
  )
);

create policy "Documents: partner access" on public.documents
for select using (
  exists (
    select 1
    from public.requests r
    join public.partners pr on pr.id = r.partner_id
    where r.document_id = public.documents.id
      and pr.user_id = auth.uid()
      and r.partner_share_allowed
      and r.billing_status = 'paid'
  )
);

alter table public.requests enable row level security;
alter table public.requests force row level security;

create policy "Requests: owner read" on public.requests
for select using (user_id = auth.uid());

create policy "Requests: owner write" on public.requests
for insert with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.documents d
    where d.id = public.requests.document_id
      and d.user_id = auth.uid()
  )
);

create policy "Requests: owner update" on public.requests
for update using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Requests: admin manage" on public.requests
for all using (public.is_admin()) with check (public.is_admin());

create policy "Requests: agent access" on public.requests
for select using (agent_id = auth.uid());

create policy "Requests: agent update" on public.requests
for update using (agent_id = auth.uid()) with check (agent_id = auth.uid());

create policy "Requests: partner access" on public.requests
for select using (
  exists (
    select 1 from public.partners pr
    where pr.id = public.requests.partner_id
      and pr.user_id = auth.uid()
  )
  and partner_share_allowed
  and billing_status = 'paid'
);

alter table public.analyses enable row level security;
alter table public.analyses force row level security;

create policy "Analyses: owner read" on public.analyses
for select using (
  exists (
    select 1 from public.requests r
    where r.id = public.analyses.request_id
      and r.user_id = auth.uid()
  )
);

create policy "Analyses: agent read" on public.analyses
for select using (
  exists (
    select 1 from public.requests r
    where r.id = public.analyses.request_id
      and r.agent_id = auth.uid()
  )
);

create policy "Analyses: agent insert" on public.analyses
for insert with check (
  exists (
    select 1 from public.requests r
    where r.id = public.analyses.request_id
      and r.agent_id = auth.uid()
  )
);

create policy "Analyses: agent update" on public.analyses
for update using (
  exists (
    select 1 from public.requests r
    where r.id = public.analyses.request_id
      and r.agent_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.requests r
    where r.id = public.analyses.request_id
      and r.agent_id = auth.uid()
  )
);

create policy "Analyses: partner read" on public.analyses
for select using (
  exists (
    select 1
    from public.requests r
    join public.partners pr on pr.id = r.partner_id
    where r.id = public.analyses.request_id
      and pr.user_id = auth.uid()
      and r.partner_share_allowed
      and r.billing_status = 'paid'
  )
);

create policy "Analyses: admin manage" on public.analyses
for all using (public.is_admin()) with check (public.is_admin());

alter table public.translations enable row level security;
alter table public.translations force row level security;

create policy "Translations: owner read" on public.translations
for select using (
  exists (
    select 1 from public.requests r
    where r.id = public.translations.request_id
      and r.user_id = auth.uid()
  )
);

create policy "Translations: agent read" on public.translations
for select using (
  exists (
    select 1 from public.requests r
    where r.id = public.translations.request_id
      and r.agent_id = auth.uid()
  )
);

create policy "Translations: partner read" on public.translations
for select using (
  exists (
    select 1
    from public.requests r
    join public.partners pr on pr.id = r.partner_id
    where r.id = public.translations.request_id
      and pr.user_id = auth.uid()
      and r.partner_share_allowed
      and r.billing_status = 'paid'
  )
);

create policy "Translations: agent insert" on public.translations
for insert with check (
  exists (
    select 1 from public.requests r
    where r.id = public.translations.request_id
      and r.agent_id = auth.uid()
  )
);

create policy "Translations: agent update" on public.translations
for update using (
  exists (
    select 1 from public.requests r
    where r.id = public.translations.request_id
      and r.agent_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.requests r
    where r.id = public.translations.request_id
      and r.agent_id = auth.uid()
  )
);

create policy "Translations: admin manage" on public.translations
for all using (public.is_admin()) with check (public.is_admin());

alter table public.payments enable row level security;
alter table public.payments force row level security;

create policy "Payments: owner read" on public.payments
for select using (user_id = auth.uid());

create policy "Payments: agent read" on public.payments
for select using (
  exists (
    select 1 from public.requests r
    where r.id = public.payments.request_id
      and r.agent_id = auth.uid()
  )
);

create policy "Payments: admin manage" on public.payments
for all using (public.is_admin()) with check (public.is_admin());

alter table public.pricing_plans enable row level security;
alter table public.pricing_plans force row level security;

create policy "Pricing plans: public read" on public.pricing_plans
for select using (active and visible or public.is_admin());

create policy "Pricing plans: admin manage" on public.pricing_plans
for all using (public.is_admin()) with check (public.is_admin());

alter table public.pricing_addons enable row level security;
alter table public.pricing_addons force row level security;

create policy "Pricing addons: public read" on public.pricing_addons
for select using (active and visible or public.is_admin());

create policy "Pricing addons: admin manage" on public.pricing_addons
for all using (public.is_admin()) with check (public.is_admin());

alter table public.purchase_items enable row level security;
alter table public.purchase_items force row level security;

create policy "Purchase items: owner read" on public.purchase_items
for select using (
  exists (
    select 1 from public.payments p
    where p.id = public.purchase_items.payment_id
      and p.user_id = auth.uid()
  )
);

create policy "Purchase items: admin manage" on public.purchase_items
for all using (public.is_admin()) with check (public.is_admin());

alter table public.partner_applications enable row level security;
alter table public.partner_applications force row level security;

create policy "Partner applications: public submit" on public.partner_applications
for insert with check (true);

create policy "Partner applications: admin manage" on public.partner_applications
for all using (public.is_admin()) with check (public.is_admin());

alter table public.contact_messages enable row level security;
alter table public.contact_messages force row level security;

create policy "Contact messages: public submit" on public.contact_messages
for insert with check (true);

create policy "Contact messages: admin manage" on public.contact_messages
for all using (public.is_admin()) with check (public.is_admin());

alter table public.webhooks enable row level security;
alter table public.webhooks force row level security;

create policy "Webhooks: admin manage" on public.webhooks
for all using (public.is_admin()) with check (public.is_admin());

alter table public.audit_logs enable row level security;
alter table public.audit_logs force row level security;

create policy "Audit logs: admin read" on public.audit_logs
for select using (public.is_admin());

create policy "Audit logs: admin manage" on public.audit_logs
for all using (public.is_admin()) with check (public.is_admin());

alter table public.consents enable row level security;
alter table public.consents force row level security;

create policy "Consents: owner manage" on public.consents
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Consents: admin manage" on public.consents
for all using (public.is_admin()) with check (public.is_admin());
