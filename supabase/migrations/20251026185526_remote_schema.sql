create extension if not exists "citext" with schema "extensions";


create type "public"."case_message_kind_enum" as enum ('user', 'system', 'ai_analysis');

create type "public"."case_priority_enum" as enum ('low', 'normal', 'high', 'urgent');

create type "public"."case_status_enum" as enum ('new', 'awaiting_docs', 'in_review', 'needs_info', 'completed', 'closed');

create type "public"."consent_type_enum" as enum ('terms', 'privacy', 'marketing', 'data_processing');

create type "public"."document_type_enum" as enum ('upload', 'ai_summary', 'translation', 'evidence');

create type "public"."kyc_file_status_enum" as enum ('pending', 'approved', 'rejected');

create type "public"."kyc_status_enum" as enum ('none', 'pending', 'verified', 'rejected');

create type "public"."message_visibility_enum" as enum ('public', 'internal');

create type "public"."notification_channel_enum" as enum ('email', 'sms', 'inapp');

create type "public"."order_status" as enum ('draft', 'open', 'paid', 'canceled', 'refunded');

create type "public"."order_status_enum" as enum ('draft', 'pending', 'paid', 'cancelled', 'refunded');

create type "public"."partner_role_enum" as enum ('partner_admin', 'partner_member', 'reviewer');

create type "public"."partner_status_enum" as enum ('pending', 'active', 'suspended');

create type "public"."payment_provider" as enum ('stripe');

create type "public"."payment_provider_enum" as enum ('stripe', 'transfer', 'other');

create type "public"."payment_status_enum" as enum ('pending', 'succeeded', 'failed', 'refunded');

create type "public"."role_enum" as enum ('admin', 'reviewer', 'partner_admin', 'partner_member', 'client');

create type "public"."task_status_enum" as enum ('todo', 'doing', 'blocked', 'done');

create type "public"."template_type_enum" as enum ('document', 'faq', 'email');

revoke delete on table "public"."contact_messages" from "anon";

revoke insert on table "public"."contact_messages" from "anon";

revoke references on table "public"."contact_messages" from "anon";

revoke select on table "public"."contact_messages" from "anon";

revoke trigger on table "public"."contact_messages" from "anon";

revoke truncate on table "public"."contact_messages" from "anon";

revoke update on table "public"."contact_messages" from "anon";

revoke delete on table "public"."contact_messages" from "authenticated";

revoke insert on table "public"."contact_messages" from "authenticated";

revoke references on table "public"."contact_messages" from "authenticated";

revoke select on table "public"."contact_messages" from "authenticated";

revoke trigger on table "public"."contact_messages" from "authenticated";

revoke truncate on table "public"."contact_messages" from "authenticated";

revoke update on table "public"."contact_messages" from "authenticated";

revoke delete on table "public"."contact_messages" from "service_role";

revoke insert on table "public"."contact_messages" from "service_role";

revoke references on table "public"."contact_messages" from "service_role";

revoke select on table "public"."contact_messages" from "service_role";

revoke trigger on table "public"."contact_messages" from "service_role";

revoke truncate on table "public"."contact_messages" from "service_role";

revoke update on table "public"."contact_messages" from "service_role";

alter table "public"."contact_messages" drop constraint "contact_messages_pkey";

drop index if exists "public"."contact_messages_pkey";

drop table "public"."contact_messages";

create table "public"."ai_jobs" (
    "id" uuid not null default gen_random_uuid(),
    "case_id" uuid not null,
    "document_version_id" uuid not null,
    "priority" integer not null default 5,
    "status" text not null default 'queued'::text,
    "result" jsonb,
    "error_details" jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."ai_jobs" enable row level security;

create table "public"."app_users" (
    "user_id" uuid not null,
    "full_name" text,
    "email" extensions.citext not null,
    "phone" text,
    "global_role" role_enum not null default 'client'::role_enum,
    "stripe_customer_id" text,
    "is_active" boolean not null default true,
    "metadata" jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."app_users" enable row level security;

create table "public"."audit_logs" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid,
    "action" text not null,
    "target_resource" text,
    "target_record_id" uuid,
    "details" jsonb,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."audit_logs" enable row level security;

create table "public"."case_checklist_items" (
    "id" uuid not null default gen_random_uuid(),
    "case_id" uuid not null,
    "title" text not null,
    "is_completed" boolean not null default false,
    "completed_by_user_id" uuid,
    "completed_at" timestamp with time zone,
    "sort_order" integer,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."case_checklist_items" enable row level security;

create table "public"."case_details" (
    "id" uuid not null default gen_random_uuid(),
    "case_id" uuid not null,
    "agency" text,
    "procedure_name" text,
    "external_reference" text,
    "internal_reference" text,
    "official_deadline" date,
    "summary_plain_lang" text,
    "obligations_plain_lang" text,
    "next_steps_plain_lang" text,
    "kpis" jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."case_details" enable row level security;

create table "public"."case_messages" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "case_id" uuid not null,
    "sender_user_id" uuid,
    "visibility" message_visibility_enum not null default 'public'::message_visibility_enum,
    "body_text" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "kind" case_message_kind_enum not null default 'user'::case_message_kind_enum
);


alter table "public"."case_messages" enable row level security;

create table "public"."cases" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "title" text,
    "description" text,
    "status" case_status_enum not null default 'new'::case_status_enum,
    "priority" case_priority_enum not null default 'normal'::case_priority_enum,
    "client_user_id" uuid,
    "partner_id" uuid,
    "assigned_reviewer_user_id" uuid,
    "service_id" uuid not null,
    "due_date" date,
    "sla_hours" integer,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."cases" enable row level security;

create table "public"."clients" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid not null,
    "billing_info" jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "phone" text,
    "billing_address" jsonb
);


alter table "public"."clients" enable row level security;

create table "public"."consents" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid not null,
    "consent_type" consent_type_enum not null,
    "granted" boolean not null,
    "ip" inet,
    "user_agent" text,
    "version" text,
    "granted_at" timestamp with time zone not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."consents" enable row level security;

create table "public"."document_versions" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "document_id" uuid not null,
    "version_number" integer not null,
    "storage_path" text not null,
    "notes" text,
    "created_by_user_id" uuid,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."document_versions" enable row level security;

create table "public"."documents" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "case_id" uuid not null,
    "owner_user_id" uuid,
    "doc_type" document_type_enum not null,
    "filename" text not null,
    "mime_type" text,
    "size_bytes" bigint,
    "checksum" text,
    "language" text default 'es'::text,
    "is_confidential" boolean not null default false,
    "current_version" integer not null default 1,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "metadata" jsonb,
    "scan_status" text not null default 'pending'::text,
    "scan_details" jsonb
);


alter table "public"."documents" enable row level security;

create table "public"."invoices" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "order_id" uuid not null,
    "series" text not null,
    "number" integer not null,
    "issue_date" date not null default CURRENT_DATE,
    "due_date" date,
    "total_cents" integer not null,
    "pdf_url" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "customer_details" jsonb
);


alter table "public"."invoices" enable row level security;

create table "public"."kyc_files" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "partner_id" uuid not null,
    "file_type" text not null,
    "storage_path" text not null,
    "status" kyc_file_status_enum not null default 'pending'::kyc_file_status_enum,
    "notes" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."kyc_files" enable row level security;

create table "public"."notifications" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid not null,
    "channel" notification_channel_enum not null,
    "template" text,
    "payload" jsonb,
    "sent_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."notifications" enable row level security;

create table "public"."order_items" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "order_id" uuid not null,
    "service_id" uuid not null,
    "case_id" uuid,
    "qty" integer not null default 1,
    "unit_price_cents" integer not null,
    "vat_rate" numeric(5,2) not null,
    "total_cents" integer generated always as ((qty * unit_price_cents)) stored,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."order_items" enable row level security;

create table "public"."orders" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "client_user_id" uuid not null,
    "partner_id" uuid,
    "status" order_status not null default 'draft'::order_status,
    "currency" character(3) not null default 'EUR'::bpchar,
    "total_cents" integer not null default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."orders" enable row level security;

create table "public"."partner_memberships" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "partner_id" uuid not null,
    "user_id" uuid not null,
    "role_in_partner" partner_role_enum not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."partner_memberships" enable row level security;

create table "public"."partners" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "name" text not null,
    "tax_id" text,
    "contact_email" extensions.citext,
    "status" partner_status_enum not null default 'pending'::partner_status_enum,
    "kyc_status" kyc_status_enum not null default 'none'::kyc_status_enum,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."partners" enable row level security;

create table "public"."payments" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "order_id" uuid not null,
    "provider" payment_provider not null default 'stripe'::payment_provider,
    "status" payment_status_enum not null default 'pending'::payment_status_enum,
    "amount_cents" integer not null,
    "currency" character(3) not null,
    "external_id" text,
    "raw_payload" jsonb,
    "payment_intent_id" text,
    "charge_id" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."payments" enable row level security;

create table "public"."profiles" (
    "id" uuid not null,
    "full_name" text,
    "role" text not null
);


alter table "public"."profiles" enable row level security;

create table "public"."referrals" (
    "id" uuid not null default gen_random_uuid(),
    "case_id" uuid not null,
    "partner_id" uuid not null,
    "status" text not null default 'new'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."referrals" enable row level security;

create table "public"."reviews" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "case_id" uuid,
    "from_user_id" uuid not null,
    "to_partner_id" uuid not null,
    "rating" integer not null,
    "comment" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."reviews" enable row level security;

create table "public"."services" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "code" text not null,
    "name" text not null,
    "base_price_cents" integer not null default 0,
    "vat_rate" numeric(5,2) not null default 21.00,
    "is_active" boolean not null default true,
    "stripe_price_id" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."services" enable row level security;

create table "public"."tasks" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "case_id" uuid not null,
    "assignee_user_id" uuid,
    "title" text not null,
    "description" text,
    "status" task_status_enum not null default 'todo'::task_status_enum,
    "due_date" date,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."tasks" enable row level security;

create table "public"."templates" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "type" template_type_enum not null,
    "code" text not null,
    "name" text,
    "language" text not null default 'es'::text,
    "content" text not null,
    "metadata" jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."templates" enable row level security;

create table "public"."webhook_events" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "provider" text not null default 'stripe'::text,
    "event_id" text not null,
    "type" text not null,
    "payload" jsonb not null,
    "received_at" timestamp with time zone not null default now(),
    "status" text default 'received'::text
);


alter table "public"."webhook_events" enable row level security;

CREATE UNIQUE INDEX ai_jobs_pkey ON public.ai_jobs USING btree (id);

CREATE UNIQUE INDEX app_users_email_key ON public.app_users USING btree (email);

CREATE UNIQUE INDEX app_users_pkey ON public.app_users USING btree (user_id);

CREATE UNIQUE INDEX audit_logs_pkey ON public.audit_logs USING btree (id);

CREATE UNIQUE INDEX case_checklist_items_pkey ON public.case_checklist_items USING btree (id);

CREATE UNIQUE INDEX case_details_case_id_key ON public.case_details USING btree (case_id);

CREATE UNIQUE INDEX case_details_pkey ON public.case_details USING btree (id);

CREATE UNIQUE INDEX case_messages_pkey ON public.case_messages USING btree (id);

CREATE UNIQUE INDEX cases_pkey ON public.cases USING btree (id);

CREATE UNIQUE INDEX clients_pkey ON public.clients USING btree (id);

CREATE UNIQUE INDEX clients_user_id_key ON public.clients USING btree (user_id);

CREATE UNIQUE INDEX consents_pkey ON public.consents USING btree (id);

CREATE UNIQUE INDEX consents_user_id_consent_type_version_key ON public.consents USING btree (user_id, consent_type, version);

CREATE UNIQUE INDEX document_versions_document_id_version_number_key ON public.document_versions USING btree (document_id, version_number);

CREATE UNIQUE INDEX document_versions_pkey ON public.document_versions USING btree (id);

CREATE UNIQUE INDEX documents_pkey ON public.documents USING btree (id);

CREATE INDEX idx_ai_jobs_case_id ON public.ai_jobs USING btree (case_id);

CREATE INDEX idx_ai_jobs_document_version_id ON public.ai_jobs USING btree (document_version_id);

CREATE INDEX idx_ai_jobs_status_priority ON public.ai_jobs USING btree (status, priority);

CREATE INDEX idx_app_users_email ON public.app_users USING btree (email);

CREATE INDEX idx_audit_logs_record ON public.audit_logs USING btree (target_resource, target_record_id);

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs USING btree (user_id);

CREATE INDEX idx_case_messages_case_id ON public.case_messages USING btree (case_id);

CREATE INDEX idx_case_messages_sender_user_id ON public.case_messages USING btree (sender_user_id);

CREATE INDEX idx_cases_assigned_reviewer_user_id ON public.cases USING btree (assigned_reviewer_user_id);

CREATE INDEX idx_cases_client_user_id ON public.cases USING btree (client_user_id);

CREATE INDEX idx_cases_partner_id ON public.cases USING btree (partner_id);

CREATE INDEX idx_cases_partner_id_status ON public.cases USING btree (partner_id, status);

CREATE INDEX idx_cases_priority ON public.cases USING btree (priority);

CREATE INDEX idx_cases_service_id ON public.cases USING btree (service_id);

CREATE INDEX idx_cases_status ON public.cases USING btree (status);

CREATE INDEX idx_clients_user_id ON public.clients USING btree (user_id);

CREATE INDEX idx_consents_user_id ON public.consents USING btree (user_id);

CREATE INDEX idx_document_versions_created_by_user_id ON public.document_versions USING btree (created_by_user_id);

CREATE INDEX idx_document_versions_document_id ON public.document_versions USING btree (document_id);

CREATE INDEX idx_documents_case_id ON public.documents USING btree (case_id);

CREATE INDEX idx_documents_doc_type ON public.documents USING btree (doc_type);

CREATE INDEX idx_documents_owner_user_id ON public.documents USING btree (owner_user_id);

CREATE INDEX idx_invoices_order_id ON public.invoices USING btree (order_id);

CREATE INDEX idx_invoices_series_number ON public.invoices USING btree (series, number);

CREATE INDEX idx_kyc_files_partner_id ON public.kyc_files USING btree (partner_id);

CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);

CREATE INDEX idx_order_items_case_id ON public.order_items USING btree (case_id);

CREATE INDEX idx_order_items_order_id ON public.order_items USING btree (order_id);

CREATE INDEX idx_order_items_service_id ON public.order_items USING btree (service_id);

CREATE INDEX idx_orders_client_user_id ON public.orders USING btree (client_user_id);

CREATE INDEX idx_orders_partner_id ON public.orders USING btree (partner_id);

CREATE INDEX idx_orders_status ON public.orders USING btree (status);

CREATE INDEX idx_partner_memberships_partner_id ON public.partner_memberships USING btree (partner_id);

CREATE INDEX idx_partner_memberships_user_id ON public.partner_memberships USING btree (user_id);

CREATE INDEX idx_partners_contact_email ON public.partners USING btree (contact_email);

CREATE INDEX idx_partners_tax_id ON public.partners USING btree (tax_id);

CREATE INDEX idx_payments_external_id ON public.payments USING btree (external_id);

CREATE INDEX idx_payments_order_id ON public.payments USING btree (order_id);

CREATE INDEX idx_payments_payment_intent_id ON public.payments USING btree (payment_intent_id);

CREATE INDEX idx_reviews_from_user_id ON public.reviews USING btree (from_user_id);

CREATE INDEX idx_reviews_to_partner_id ON public.reviews USING btree (to_partner_id);

CREATE INDEX idx_services_code ON public.services USING btree (code);

CREATE INDEX idx_tasks_assignee_user_id ON public.tasks USING btree (assignee_user_id);

CREATE INDEX idx_tasks_case_id ON public.tasks USING btree (case_id);

CREATE INDEX idx_tasks_status ON public.tasks USING btree (status);

CREATE UNIQUE INDEX invoices_order_id_key ON public.invoices USING btree (order_id);

CREATE UNIQUE INDEX invoices_pkey ON public.invoices USING btree (id);

CREATE UNIQUE INDEX invoices_series_number_key ON public.invoices USING btree (series, number);

CREATE UNIQUE INDEX kyc_files_pkey ON public.kyc_files USING btree (id);

CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);

CREATE UNIQUE INDEX order_items_pkey ON public.order_items USING btree (id);

CREATE UNIQUE INDEX orders_pkey ON public.orders USING btree (id);

CREATE UNIQUE INDEX partner_memberships_partner_id_user_id_key ON public.partner_memberships USING btree (partner_id, user_id);

CREATE UNIQUE INDEX partner_memberships_pkey ON public.partner_memberships USING btree (id);

CREATE UNIQUE INDEX partners_pkey ON public.partners USING btree (id);

CREATE UNIQUE INDEX partners_tax_id_key ON public.partners USING btree (tax_id);

CREATE UNIQUE INDEX payments_pkey ON public.payments USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX referrals_pkey ON public.referrals USING btree (id);

CREATE UNIQUE INDEX reviews_case_id_key ON public.reviews USING btree (case_id);

CREATE UNIQUE INDEX reviews_pkey ON public.reviews USING btree (id);

CREATE UNIQUE INDEX services_code_key ON public.services USING btree (code);

CREATE UNIQUE INDEX services_pkey ON public.services USING btree (id);

CREATE UNIQUE INDEX tasks_pkey ON public.tasks USING btree (id);

CREATE UNIQUE INDEX templates_code_key ON public.templates USING btree (code);

CREATE UNIQUE INDEX templates_pkey ON public.templates USING btree (id);

CREATE UNIQUE INDEX uq_document_version ON public.document_versions USING btree (document_id, version_number);

CREATE UNIQUE INDEX uq_invoice_series_number ON public.invoices USING btree (series, number);

CREATE UNIQUE INDEX webhook_events_event_id_key ON public.webhook_events USING btree (event_id);

CREATE UNIQUE INDEX webhook_events_pkey ON public.webhook_events USING btree (id);

alter table "public"."ai_jobs" add constraint "ai_jobs_pkey" PRIMARY KEY using index "ai_jobs_pkey";

alter table "public"."app_users" add constraint "app_users_pkey" PRIMARY KEY using index "app_users_pkey";

alter table "public"."audit_logs" add constraint "audit_logs_pkey" PRIMARY KEY using index "audit_logs_pkey";

alter table "public"."case_checklist_items" add constraint "case_checklist_items_pkey" PRIMARY KEY using index "case_checklist_items_pkey";

alter table "public"."case_details" add constraint "case_details_pkey" PRIMARY KEY using index "case_details_pkey";

alter table "public"."case_messages" add constraint "case_messages_pkey" PRIMARY KEY using index "case_messages_pkey";

alter table "public"."cases" add constraint "cases_pkey" PRIMARY KEY using index "cases_pkey";

alter table "public"."clients" add constraint "clients_pkey" PRIMARY KEY using index "clients_pkey";

alter table "public"."consents" add constraint "consents_pkey" PRIMARY KEY using index "consents_pkey";

alter table "public"."document_versions" add constraint "document_versions_pkey" PRIMARY KEY using index "document_versions_pkey";

alter table "public"."documents" add constraint "documents_pkey" PRIMARY KEY using index "documents_pkey";

alter table "public"."invoices" add constraint "invoices_pkey" PRIMARY KEY using index "invoices_pkey";

alter table "public"."kyc_files" add constraint "kyc_files_pkey" PRIMARY KEY using index "kyc_files_pkey";

alter table "public"."notifications" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."order_items" add constraint "order_items_pkey" PRIMARY KEY using index "order_items_pkey";

alter table "public"."orders" add constraint "orders_pkey" PRIMARY KEY using index "orders_pkey";

alter table "public"."partner_memberships" add constraint "partner_memberships_pkey" PRIMARY KEY using index "partner_memberships_pkey";

alter table "public"."partners" add constraint "partners_pkey" PRIMARY KEY using index "partners_pkey";

alter table "public"."payments" add constraint "payments_pkey" PRIMARY KEY using index "payments_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."referrals" add constraint "referrals_pkey" PRIMARY KEY using index "referrals_pkey";

alter table "public"."reviews" add constraint "reviews_pkey" PRIMARY KEY using index "reviews_pkey";

alter table "public"."services" add constraint "services_pkey" PRIMARY KEY using index "services_pkey";

alter table "public"."tasks" add constraint "tasks_pkey" PRIMARY KEY using index "tasks_pkey";

alter table "public"."templates" add constraint "templates_pkey" PRIMARY KEY using index "templates_pkey";

alter table "public"."webhook_events" add constraint "webhook_events_pkey" PRIMARY KEY using index "webhook_events_pkey";

alter table "public"."ai_jobs" add constraint "ai_jobs_case_id_fkey" FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE not valid;

alter table "public"."ai_jobs" validate constraint "ai_jobs_case_id_fkey";

alter table "public"."ai_jobs" add constraint "ai_jobs_document_version_id_fkey" FOREIGN KEY (document_version_id) REFERENCES document_versions(id) ON DELETE CASCADE not valid;

alter table "public"."ai_jobs" validate constraint "ai_jobs_document_version_id_fkey";

alter table "public"."app_users" add constraint "app_users_email_key" UNIQUE using index "app_users_email_key";

alter table "public"."app_users" add constraint "app_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."app_users" validate constraint "app_users_user_id_fkey";

alter table "public"."audit_logs" add constraint "audit_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES app_users(user_id) ON DELETE SET NULL not valid;

alter table "public"."audit_logs" validate constraint "audit_logs_user_id_fkey";

alter table "public"."case_checklist_items" add constraint "case_checklist_items_case_id_fkey" FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE not valid;

alter table "public"."case_checklist_items" validate constraint "case_checklist_items_case_id_fkey";

alter table "public"."case_checklist_items" add constraint "case_checklist_items_completed_by_user_id_fkey" FOREIGN KEY (completed_by_user_id) REFERENCES app_users(user_id) not valid;

alter table "public"."case_checklist_items" validate constraint "case_checklist_items_completed_by_user_id_fkey";

alter table "public"."case_details" add constraint "case_details_case_id_fkey" FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE not valid;

alter table "public"."case_details" validate constraint "case_details_case_id_fkey";

alter table "public"."case_details" add constraint "case_details_case_id_key" UNIQUE using index "case_details_case_id_key";

alter table "public"."case_messages" add constraint "case_messages_case_id_fkey" FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE not valid;

alter table "public"."case_messages" validate constraint "case_messages_case_id_fkey";

alter table "public"."case_messages" add constraint "case_messages_sender_user_id_fkey" FOREIGN KEY (sender_user_id) REFERENCES app_users(user_id) ON DELETE SET NULL not valid;

alter table "public"."case_messages" validate constraint "case_messages_sender_user_id_fkey";

alter table "public"."cases" add constraint "cases_assigned_reviewer_user_id_fkey" FOREIGN KEY (assigned_reviewer_user_id) REFERENCES app_users(user_id) ON DELETE SET NULL not valid;

alter table "public"."cases" validate constraint "cases_assigned_reviewer_user_id_fkey";

alter table "public"."cases" add constraint "cases_client_user_id_fkey" FOREIGN KEY (client_user_id) REFERENCES app_users(user_id) ON DELETE RESTRICT not valid;

alter table "public"."cases" validate constraint "cases_client_user_id_fkey";

alter table "public"."cases" add constraint "cases_partner_id_fkey" FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE SET NULL not valid;

alter table "public"."cases" validate constraint "cases_partner_id_fkey";

alter table "public"."cases" add constraint "cases_service_id_fkey" FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT not valid;

alter table "public"."cases" validate constraint "cases_service_id_fkey";

alter table "public"."clients" add constraint "clients_user_id_fkey" FOREIGN KEY (user_id) REFERENCES app_users(user_id) ON DELETE CASCADE not valid;

alter table "public"."clients" validate constraint "clients_user_id_fkey";

alter table "public"."clients" add constraint "clients_user_id_key" UNIQUE using index "clients_user_id_key";

alter table "public"."consents" add constraint "consents_user_id_consent_type_version_key" UNIQUE using index "consents_user_id_consent_type_version_key";

alter table "public"."consents" add constraint "consents_user_id_fkey" FOREIGN KEY (user_id) REFERENCES app_users(user_id) ON DELETE CASCADE not valid;

alter table "public"."consents" validate constraint "consents_user_id_fkey";

alter table "public"."document_versions" add constraint "document_versions_created_by_user_id_fkey" FOREIGN KEY (created_by_user_id) REFERENCES app_users(user_id) ON DELETE SET NULL not valid;

alter table "public"."document_versions" validate constraint "document_versions_created_by_user_id_fkey";

alter table "public"."document_versions" add constraint "document_versions_document_id_fkey" FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE not valid;

alter table "public"."document_versions" validate constraint "document_versions_document_id_fkey";

alter table "public"."document_versions" add constraint "document_versions_document_id_version_number_key" UNIQUE using index "document_versions_document_id_version_number_key";

alter table "public"."document_versions" add constraint "uq_document_version" UNIQUE using index "uq_document_version";

alter table "public"."documents" add constraint "documents_case_id_fkey" FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE not valid;

alter table "public"."documents" validate constraint "documents_case_id_fkey";

alter table "public"."documents" add constraint "documents_owner_user_id_fkey" FOREIGN KEY (owner_user_id) REFERENCES app_users(user_id) ON DELETE SET NULL not valid;

alter table "public"."documents" validate constraint "documents_owner_user_id_fkey";

alter table "public"."invoices" add constraint "invoices_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT not valid;

alter table "public"."invoices" validate constraint "invoices_order_id_fkey";

alter table "public"."invoices" add constraint "invoices_order_id_key" UNIQUE using index "invoices_order_id_key";

alter table "public"."invoices" add constraint "invoices_series_number_key" UNIQUE using index "invoices_series_number_key";

alter table "public"."invoices" add constraint "uq_invoice_series_number" UNIQUE using index "uq_invoice_series_number";

alter table "public"."kyc_files" add constraint "kyc_files_partner_id_fkey" FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE not valid;

alter table "public"."kyc_files" validate constraint "kyc_files_partner_id_fkey";

alter table "public"."notifications" add constraint "notifications_template_fkey" FOREIGN KEY (template) REFERENCES templates(code) not valid;

alter table "public"."notifications" validate constraint "notifications_template_fkey";

alter table "public"."notifications" add constraint "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES app_users(user_id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_user_id_fkey";

alter table "public"."order_items" add constraint "fk_order_id" FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE not valid;

alter table "public"."order_items" validate constraint "fk_order_id";

alter table "public"."order_items" add constraint "order_items_case_id_fkey" FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE SET NULL not valid;

alter table "public"."order_items" validate constraint "order_items_case_id_fkey";

alter table "public"."order_items" add constraint "order_items_service_id_fkey" FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT not valid;

alter table "public"."order_items" validate constraint "order_items_service_id_fkey";

alter table "public"."orders" add constraint "orders_client_user_id_fkey" FOREIGN KEY (client_user_id) REFERENCES app_users(user_id) ON DELETE RESTRICT not valid;

alter table "public"."orders" validate constraint "orders_client_user_id_fkey";

alter table "public"."orders" add constraint "orders_partner_id_fkey" FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE SET NULL not valid;

alter table "public"."orders" validate constraint "orders_partner_id_fkey";

alter table "public"."partner_memberships" add constraint "partner_memberships_partner_id_fkey" FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE not valid;

alter table "public"."partner_memberships" validate constraint "partner_memberships_partner_id_fkey";

alter table "public"."partner_memberships" add constraint "partner_memberships_partner_id_user_id_key" UNIQUE using index "partner_memberships_partner_id_user_id_key";

alter table "public"."partner_memberships" add constraint "partner_memberships_user_id_fkey" FOREIGN KEY (user_id) REFERENCES app_users(user_id) ON DELETE CASCADE not valid;

alter table "public"."partner_memberships" validate constraint "partner_memberships_user_id_fkey";

alter table "public"."partners" add constraint "partners_tax_id_key" UNIQUE using index "partners_tax_id_key";

alter table "public"."payments" add constraint "payments_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE not valid;

alter table "public"."payments" validate constraint "payments_order_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."referrals" add constraint "referrals_case_id_fkey" FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE not valid;

alter table "public"."referrals" validate constraint "referrals_case_id_fkey";

alter table "public"."referrals" add constraint "referrals_partner_id_fkey" FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE not valid;

alter table "public"."referrals" validate constraint "referrals_partner_id_fkey";

alter table "public"."reviews" add constraint "reviews_case_id_fkey" FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE SET NULL not valid;

alter table "public"."reviews" validate constraint "reviews_case_id_fkey";

alter table "public"."reviews" add constraint "reviews_case_id_key" UNIQUE using index "reviews_case_id_key";

alter table "public"."reviews" add constraint "reviews_from_user_id_fkey" FOREIGN KEY (from_user_id) REFERENCES app_users(user_id) ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_from_user_id_fkey";

alter table "public"."reviews" add constraint "reviews_rating_check" CHECK (((rating >= 1) AND (rating <= 5))) not valid;

alter table "public"."reviews" validate constraint "reviews_rating_check";

alter table "public"."reviews" add constraint "reviews_to_partner_id_fkey" FOREIGN KEY (to_partner_id) REFERENCES partners(id) ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_to_partner_id_fkey";

alter table "public"."services" add constraint "services_code_key" UNIQUE using index "services_code_key";

alter table "public"."tasks" add constraint "tasks_assignee_user_id_fkey" FOREIGN KEY (assignee_user_id) REFERENCES app_users(user_id) ON DELETE SET NULL not valid;

alter table "public"."tasks" validate constraint "tasks_assignee_user_id_fkey";

alter table "public"."tasks" add constraint "tasks_case_id_fkey" FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE not valid;

alter table "public"."tasks" validate constraint "tasks_case_id_fkey";

alter table "public"."templates" add constraint "templates_code_key" UNIQUE using index "templates_code_key";

alter table "public"."webhook_events" add constraint "webhook_events_event_id_key" UNIQUE using index "webhook_events_event_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.assign_invoice_number()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_series text;
    new_number integer;
BEGIN
    new_series := 'FA' || to_char(NEW.issue_date, 'YY');
    NEW.series := new_series;

    SELECT COALESCE(MAX(number), 0) + 1 INTO new_number
    FROM public.invoices
    WHERE series = new_series
    FOR UPDATE;

    NEW.number := new_number;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.can_access_case(cid uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'extensions', 'pg_temp'
AS $function$ select exists (
  select 1 from public.cases c
  where c.id = cid and (
    c.client_user_id = auth.uid()
    or c.assigned_reviewer_user_id = auth.uid()
    or public.is_partner_member(c.partner_id)
    or public.is_admin()
  )
); $function$
;

CREATE OR REPLACE FUNCTION public.create_referral_if_consented(p_case_id uuid, p_partner_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_client_user_id uuid;
    v_has_consent boolean;
    v_referral_id uuid;
BEGIN
    -- 1. Obtener el client_user_id del caso
    SELECT client_user_id INTO v_client_user_id
    FROM public.cases
    WHERE id = p_case_id;

    IF v_client_user_id IS NULL THEN
        RAISE EXCEPTION 'CASE_NOT_FOUND';
    END IF;

    -- 2. Verificar si el cliente ha dado consentimiento para compartir datos con partners
    SELECT EXISTS (
        SELECT 1
        FROM public.consents
        WHERE user_id = v_client_user_id
          AND consent_type = 'partner_contact'
          AND granted = true
    ) INTO v_has_consent;

    -- 3. Si no hay consentimiento, registrar en auditoría y lanzar error
    IF NOT v_has_consent THEN
        INSERT INTO public.audit_logs (user_id, action, target_resource, target_record_id, details)
        VALUES (
            auth.uid(),
            'create_referral_blocked',
            'cases',
            p_case_id,
            jsonb_build_object(
                'reason', 'FORBIDDEN_PARTNER_CONTACT',
                'partner_id', p_partner_id
            )
        );
        RAISE EXCEPTION 'FORBIDDEN_PARTNER_CONTACT';
    END IF;

    -- 4. Si hay consentimiento, crear el referral
    INSERT INTO public.referrals (case_id, partner_id, status)
    VALUES (p_case_id, p_partner_id, 'new')
    RETURNING id INTO v_referral_id;

    -- 5. Opcional: Registrar la creación exitosa en auditoría
    INSERT INTO public.audit_logs (user_id, action, target_resource, target_record_id, details)
    VALUES (
        auth.uid(),
        'create_referral_success',
        'referrals',
        v_referral_id,
        jsonb_build_object(
            'case_id', p_case_id,
            'partner_id', p_partner_id
        )
    );

    RETURN v_referral_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_old_documents()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    seven_days_ago timestamp;
BEGIN
    seven_days_ago := now() - interval '7 days';

    -- Elimina objetos de storage que fueron creados hace más de 7 días
    -- y que no están asociados a un caso que todavía esté activo.
    -- Esta es una simplificación. Una implementación más robusta podría
    -- basarse en el estado del caso o en una tabla de 'documentos'.
    DELETE FROM storage.objects
    WHERE bucket_id = 'documents'
      AND created_at < seven_days_ago;

    -- Opcional: si tienes una tabla `documents`, también puedes limpiarla.
    -- DELETE FROM public.documents
    -- WHERE created_at < seven_days_ago;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_unverified_users()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Borra usuarios de auth.users que no han confirmado su email en 24 horas.
  -- Gracias a ON DELETE CASCADE, esto eliminará también la entrada en
  -- public.app_users y todos los datos asociados.
  DELETE FROM auth.users
  WHERE email_confirmed_at IS NULL
    AND created_at < (now() - interval '24 hours');
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_my_partner_id()
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT partner_id FROM public.partner_memberships WHERE user_id = auth.uid() LIMIT 1;
$function$
;

CREATE OR REPLACE FUNCTION public.get_my_role()
 RETURNS role_enum
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT global_role FROM public.app_users WHERE user_id = auth.uid() LIMIT 1;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    user_role public.role_enum;
    new_partner_id uuid;
BEGIN
    -- Determina el rol. Si no se especifica, por defecto es 'client'.
    user_role := COALESCE((NEW.raw_user_meta_data->>'role')::public.role_enum, 'client');

    -- Inserta el nuevo usuario en la tabla app_users.
    INSERT INTO public.app_users (user_id, full_name, email, global_role, is_active)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.email,
        user_role,
        true -- Los usuarios se activan por defecto al registrarse.
    );

    -- Si el rol es 'client', crea una entrada en la tabla 'clients'.
    IF user_role = 'client' THEN
        INSERT INTO public.clients (user_id)
        VALUES (NEW.id);
    END IF;

    -- Si el rol es 'partner_admin', crea una nueva entidad 'partner' y la membresía.
    IF user_role = 'partner_admin' THEN
        INSERT INTO public.partners (name, contact_email, status, kyc_status)
        VALUES (
            COALESCE(NEW.raw_user_meta_data->>'company_name', 'Partner sin nombre'),
            NEW.email,
            'pending',
            'none'
        )
        RETURNING id INTO new_partner_id;
        
        INSERT INTO public.partner_memberships (partner_id, user_id, role_in_partner)
        VALUES (new_partner_id, NEW.id, 'partner_admin');
    END IF;

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_payment_success(p_order_id uuid, p_stripe_payment_intent_id text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_order public.orders;
    v_client public.app_users;
    v_invoice_id uuid;
    v_customer_details jsonb;
BEGIN
    -- 1. Encontrar la orden y bloquearla para evitar condiciones de carrera
    SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;

    -- Si la orden no existe o ya está pagada, no hacer nada.
    IF v_order IS NULL OR v_order.status = 'paid' THEN
        RETURN NULL;
    END IF;

    -- 2. Actualizar el estado de la orden a 'paid'
    UPDATE public.orders
    SET status = 'paid'
    WHERE id = p_order_id;

    -- 3. Crear el registro de pago
    INSERT INTO public.payments (order_id, provider, status, amount_cents, currency, payment_intent_id, external_id)
    VALUES (p_order_id, 'stripe', 'succeeded', v_order.total_cents, v_order.currency, p_stripe_payment_intent_id, p_stripe_payment_intent_id);

    -- 4. Obtener datos del cliente para la factura
    SELECT * INTO v_client FROM public.app_users WHERE user_id = v_order.client_user_id;
    
    -- Crear el snapshot de los datos fiscales. En una app real, esto vendría de `clients.billing_info`.
    v_customer_details := jsonb_build_object(
        'name', v_client.full_name,
        'email', v_client.email,
        'tax_id', 'N/A', -- Reemplazar con datos reales
        'address', 'N/A' -- Reemplazar con datos reales
    );

    -- 5. Crear la factura
    INSERT INTO public.invoices (order_id, issue_date, due_date, total_cents, customer_details)
    VALUES (p_order_id, CURRENT_DATE, CURRENT_DATE, v_order.total_cents, v_customer_details)
    RETURNING id INTO v_invoice_id;

    -- En un escenario real, aquí se generaría el PDF de la factura y se guardaría la URL.
    -- UPDATE public.invoices SET pdf_url = '...' WHERE id = v_invoice_id;

    RETURN v_invoice_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'extensions', 'pg_temp'
AS $function$ select exists (
  select 1 from public.app_users au
  where au.user_id = auth.uid() and au.global_role = 'admin'
); $function$
;

CREATE OR REPLACE FUNCTION public.is_partner_member(pid uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'extensions', 'pg_temp'
AS $function$ select exists (
  select 1 from public.partner_memberships pm
  where pm.partner_id = pid and pm.user_id = auth.uid()
); $function$
;

CREATE OR REPLACE FUNCTION public.trigger_file_scan()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  auth_header TEXT;
BEGIN
  -- Necesitamos un token con rol de servicio para invocar la función de forma segura.
  auth_header := 'Bearer ' || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  -- Invocamos la Edge Function de forma asíncrona.
  -- No esperamos la respuesta para no bloquear el proceso de subida.
  PERFORM net.http_post(
    url := Deno.env.get('SUPABASE_URL') || '/functions/v1/scan-file',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', auth_header
    ),
    body := jsonb_build_object(
      'bucket_id', NEW.bucket_id,
      'object_path', NEW.name
    )
  );
  
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_order_total()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        UPDATE public.orders
        SET total_cents = (
            SELECT COALESCE(SUM(total_cents), 0)
            FROM public.order_items
            WHERE order_id = OLD.order_id
        )
        WHERE id = OLD.order_id;
        RETURN OLD;
    ELSE
        UPDATE public.orders
        SET total_cents = (
            SELECT COALESCE(SUM(total_cents), 0)
            FROM public.order_items
            WHERE order_id = NEW.order_id
        )
        WHERE id = NEW.order_id;
        RETURN NEW;
    END IF;
END;
$function$
;

create or replace view "public"."v_case_overview" as  SELECT c.id,
    c.title,
    c.status,
    c.priority,
    s.name AS service_name,
    au_client.full_name AS client_name,
    p.name AS partner_name,
    au_reviewer.full_name AS reviewer_name,
    c.due_date,
    c.created_at
   FROM ((((cases c
     JOIN services s ON ((c.service_id = s.id)))
     JOIN app_users au_client ON ((c.client_user_id = au_client.user_id)))
     LEFT JOIN partners p ON ((c.partner_id = p.id)))
     LEFT JOIN app_users au_reviewer ON ((c.assigned_reviewer_user_id = au_reviewer.user_id)));


create or replace view "public"."v_partner_dashboard" as  SELECT id AS partner_id,
    name AS partner_name,
    status AS partner_status,
    ( SELECT count(*) AS count
           FROM cases
          WHERE (cases.partner_id = p.id)) AS total_cases,
    ( SELECT count(*) AS count
           FROM cases
          WHERE ((cases.partner_id = p.id) AND (cases.status = 'completed'::case_status_enum))) AS completed_cases,
    ( SELECT avg(r.rating) AS avg
           FROM reviews r
          WHERE (r.to_partner_id = p.id)) AS average_rating
   FROM partners p;


create policy "Allow admin full access to ai_jobs"
on "public"."ai_jobs"
as permissive
for all
to public
using ((get_my_role() = 'admin'::role_enum));


create policy "Allow reviewer access to ai_jobs"
on "public"."ai_jobs"
as permissive
for select
to public
using ((get_my_role() = 'reviewer'::role_enum));


create policy "Allow admins full access"
on "public"."app_users"
as permissive
for all
to public
using ((get_my_role() = 'admin'::role_enum))
with check ((get_my_role() = 'admin'::role_enum));


create policy "Allow users to see their own data"
on "public"."app_users"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Allow users to update their own data"
on "public"."app_users"
as permissive
for update
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Allow admin full access to audit_logs"
on "public"."audit_logs"
as permissive
for all
to public
using ((get_my_role() = 'admin'::role_enum));


create policy "Users with case access can manage related data"
on "public"."case_checklist_items"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM cases
  WHERE (cases.id = case_checklist_items.case_id))));


create policy "Users with case access can manage related data"
on "public"."case_details"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM cases
  WHERE (cases.id = case_details.case_id))));


create policy "Users with case access can manage related data"
on "public"."case_messages"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM cases
  WHERE (cases.id = case_messages.case_id))));


create policy "Admins have full access to cases"
on "public"."cases"
as permissive
for all
to public
using ((get_my_role() = 'admin'::role_enum))
with check ((get_my_role() = 'admin'::role_enum));


create policy "Assigned reviewers can access their cases"
on "public"."cases"
as permissive
for select
to public
using ((assigned_reviewer_user_id = auth.uid()));


create policy "Clients can access their own cases"
on "public"."cases"
as permissive
for select
to public
using ((client_user_id = auth.uid()));


create policy "Partners can access their assigned cases"
on "public"."cases"
as permissive
for select
to public
using ((partner_id = get_my_partner_id()));


create policy "Allow admin full access to clients"
on "public"."clients"
as permissive
for all
to public
using ((get_my_role() = 'admin'::role_enum));


create policy "Allow client to manage their own client data"
on "public"."clients"
as permissive
for all
to public
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "Users can manage their own consents"
on "public"."consents"
as permissive
for all
to public
using ((user_id = auth.uid()));


create policy "Allow admin full access to document_versions"
on "public"."document_versions"
as permissive
for all
to public
using ((get_my_role() = 'admin'::role_enum));


create policy "Allow users with document access to manage versions"
on "public"."document_versions"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM documents d
  WHERE (d.id = document_versions.document_id))))
with check ((EXISTS ( SELECT 1
   FROM documents d
  WHERE (d.id = document_versions.document_id))));


create policy "Allow admin full access to documents"
on "public"."documents"
as permissive
for all
to public
using ((get_my_role() = 'admin'::role_enum));


create policy "Allow client to manage their own case documents"
on "public"."documents"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM cases c
  WHERE ((c.id = documents.case_id) AND (c.client_user_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM cases c
  WHERE ((c.id = documents.case_id) AND (c.client_user_id = auth.uid())))));


create policy "Allow partner members to read their assigned case documents"
on "public"."documents"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM cases c
  WHERE ((c.id = documents.case_id) AND (c.partner_id = get_my_partner_id())))));


create policy "Allow reviewer to read and update any case documents"
on "public"."documents"
as permissive
for all
to public
using ((get_my_role() = 'reviewer'::role_enum))
with check ((get_my_role() = 'reviewer'::role_enum));


create policy "Users can access invoices of their orders"
on "public"."invoices"
as permissive
for all
to public
using (((EXISTS ( SELECT 1
   FROM orders
  WHERE ((orders.id = invoices.order_id) AND (orders.client_user_id = auth.uid())))) OR (get_my_role() = 'admin'::role_enum)));


create policy "Users can see their own notifications"
on "public"."notifications"
as permissive
for select
to public
using ((user_id = auth.uid()));


create policy "Users can access items of their own orders"
on "public"."order_items"
as permissive
for select
to public
using (((get_my_role() = 'admin'::role_enum) OR (EXISTS ( SELECT 1
   FROM orders o
  WHERE ((o.id = order_items.order_id) AND (o.client_user_id = auth.uid()))))));


create policy "Clients can access their own orders"
on "public"."orders"
as permissive
for all
to public
using (((client_user_id = auth.uid()) OR (get_my_role() = 'admin'::role_enum)));


create policy "Admins and partner_admins can see their partner memberships"
on "public"."partner_memberships"
as permissive
for select
to public
using (((get_my_role() = ANY (ARRAY['admin'::role_enum, 'partner_admin'::role_enum])) AND (partner_id = get_my_partner_id())));


create policy "Users can see their own membership"
on "public"."partner_memberships"
as permissive
for select
to public
using ((user_id = auth.uid()));


create policy "Admins can see all partners"
on "public"."partners"
as permissive
for select
to public
using ((get_my_role() = 'admin'::role_enum));


create policy "Partner members can see their own partner"
on "public"."partners"
as permissive
for select
to public
using ((id = get_my_partner_id()));


create policy "Users can access payments of their orders"
on "public"."payments"
as permissive
for all
to public
using (((EXISTS ( SELECT 1
   FROM orders
  WHERE ((orders.id = payments.order_id) AND (orders.client_user_id = auth.uid())))) OR (get_my_role() = 'admin'::role_enum)));


create policy "Public profiles are viewable by everyone."
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Users can insert their own profile."
on "public"."profiles"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Users can update own profile."
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Allow admin full access to referrals"
on "public"."referrals"
as permissive
for all
to public
using ((get_my_role() = 'admin'::role_enum));


create policy "Users with case access can manage related data"
on "public"."tasks"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM cases
  WHERE (cases.id = tasks.case_id))));


create policy "Allow internal roles to read templates"
on "public"."templates"
as permissive
for select
to public
using ((get_my_role() = ANY (ARRAY['admin'::role_enum, 'reviewer'::role_enum])));


create policy "Allow admins full access"
on "public"."webhook_events"
as permissive
for all
to public
using ((get_my_role() = 'admin'::role_enum))
with check ((get_my_role() = 'admin'::role_enum));


CREATE TRIGGER on_ai_jobs_updated BEFORE UPDATE ON public.ai_jobs FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER on_app_users_updated BEFORE UPDATE ON public.app_users FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER on_case_checklist_items_updated BEFORE UPDATE ON public.case_checklist_items FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER on_case_details_updated BEFORE UPDATE ON public.case_details FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER on_case_messages_updated BEFORE UPDATE ON public.case_messages FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER on_cases_updated BEFORE UPDATE ON public.cases FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER on_clients_updated BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER on_documents_updated BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER before_insert_invoices BEFORE INSERT ON public.invoices FOR EACH ROW EXECUTE FUNCTION assign_invoice_number();

CREATE TRIGGER on_invoices_updated BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER on_kyc_files_updated BEFORE UPDATE ON public.kyc_files FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER on_notifications_updated BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER on_order_items_change AFTER INSERT OR DELETE OR UPDATE ON public.order_items FOR EACH ROW EXECUTE FUNCTION update_order_total();

CREATE TRIGGER on_order_items_updated BEFORE UPDATE ON public.order_items FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER on_orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER on_partner_memberships_updated BEFORE UPDATE ON public.partner_memberships FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER on_partners_updated BEFORE UPDATE ON public.partners FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER on_payments_updated BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER on_reviews_updated BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER on_services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER on_tasks_updated BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER on_templates_updated BEFORE UPDATE ON public.templates FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();


  create policy "Admins can upload invoices"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'invoices'::text) AND (( SELECT app_users.global_role
   FROM app_users
  WHERE (app_users.user_id = auth.uid())) = 'admin'::role_enum)));



  create policy "Allow admin full access to documents bucket"
  on "storage"."objects"
  as permissive
  for all
  to public
using (((bucket_id = 'documents'::text) AND (get_my_role() = 'admin'::role_enum)));



  create policy "Allow client to read their own case documents in storage"
  on "storage"."objects"
  as permissive
  for select
  to public
using (((bucket_id = 'documents'::text) AND ((storage.foldername(name))[1] IN ( SELECT (c.id)::text AS id
   FROM cases c
  WHERE (c.client_user_id = auth.uid())))));



  create policy "Allow client to upload to their own case folders"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check (((bucket_id = 'documents'::text) AND (get_my_role() = 'client'::role_enum) AND ((storage.foldername(name))[3] IN ( SELECT (c.id)::text AS id
   FROM cases c
  WHERE (c.client_user_id = auth.uid())))));



  create policy "Allow partner to read their assigned case documents in storage"
  on "storage"."objects"
  as permissive
  for select
  to public
using (((bucket_id = 'documents'::text) AND ((storage.foldername(name))[1] IN ( SELECT (c.id)::text AS id
   FROM cases c
  WHERE (c.partner_id = get_my_partner_id())))));



  create policy "Allow reviewer to access all case documents in storage"
  on "storage"."objects"
  as permissive
  for all
  to public
using (((bucket_id = 'documents'::text) AND (get_my_role() = 'reviewer'::role_enum)))
with check (((bucket_id = 'documents'::text) AND (get_my_role() = 'reviewer'::role_enum)));



  create policy "Authenticated users can upload documents"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'documents'::text));



  create policy "Users can read their own invoices"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'invoices'::text) AND ((storage.foldername(name))[2] = ('order_'::text || ( SELECT (o.id)::text AS id
   FROM orders o
  WHERE (o.client_user_id = auth.uid()))))));


CREATE TRIGGER on_quarantine_insert AFTER INSERT ON storage.objects FOR EACH ROW WHEN ((new.bucket_id = 'quarantine'::text)) EXECUTE FUNCTION trigger_file_scan();


