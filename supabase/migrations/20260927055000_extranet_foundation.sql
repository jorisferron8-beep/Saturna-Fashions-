-- ============================================================
-- SWU-VISION Extranet foundation — organizations, roles, profiles,
-- organization_members, navigation_items, audit_logs + RLS.
--
-- This is a record of what was applied directly to the dedicated
-- "saturna-extranet" Supabase project (via the Supabase MCP), consolidated
-- into its final, hardened form (search_path fixed, anon execute revoked,
-- FK indexes added, RLS policies split for performance). It is not wired
-- to a local Supabase CLI project yet — kept here for reproducibility and
-- so future schema changes have a migration history to build on.
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- updated_at trigger helper ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- organizations ----------
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger organizations_set_updated_at
  before update on public.organizations
  for each row execute function public.set_updated_at();

-- ---------- roles (catalog, not org-scoped) ----------
create table public.roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key in ('super_admin', 'direction', 'manager', 'employee')),
  label text not null
);

-- ---------- profiles (1:1 with auth.users) ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text not null,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_email_idx on public.profiles(email);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-provision a profile row whenever a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger-only function: never callable directly via the REST RPC endpoint.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- ---------- organization_members ----------
create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  unique (organization_id, profile_id)
);

create index organization_members_org_idx on public.organization_members(organization_id);
create index organization_members_profile_idx on public.organization_members(profile_id);
create index organization_members_role_idx on public.organization_members(role_id);

-- ---------- navigation_items ----------
create table public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  title text not null,
  slug text not null,
  icon text,
  route text,
  parent_id uuid references public.navigation_items(id) on delete cascade,
  position integer not null default 0,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index navigation_items_org_idx on public.navigation_items(organization_id);
create index navigation_items_parent_idx on public.navigation_items(parent_id);

create trigger navigation_items_set_updated_at
  before update on public.navigation_items
  for each row execute function public.set_updated_at();

-- ---------- audit_logs (insert-only, via RPC) ----------
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_org_idx on public.audit_logs(organization_id);
create index audit_logs_created_idx on public.audit_logs(created_at desc);
create index audit_logs_actor_idx on public.audit_logs(actor_id);

-- ============================================================
-- RLS helper functions (SECURITY DEFINER to avoid recursive RLS
-- on organization_members when policies reference it). Callable by
-- authenticated users only — anon execute is revoked below.
-- ============================================================

create or replace function public.is_org_member(p_organization_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = p_organization_id
      and om.profile_id = auth.uid()
      and om.status = 'active'
  );
$$;

create or replace function public.has_role(p_organization_id uuid, p_role_keys text[])
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members om
    join public.roles r on r.id = om.role_id
    where om.organization_id = p_organization_id
      and om.profile_id = auth.uid()
      and om.status = 'active'
      and r.key = any(p_role_keys)
  );
$$;

create or replace function public.shares_org_with(p_profile_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members mine
    join public.organization_members theirs
      on theirs.organization_id = mine.organization_id
    where mine.profile_id = auth.uid()
      and mine.status = 'active'
      and theirs.profile_id = p_profile_id
      and theirs.status = 'active'
  );
$$;

grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.has_role(uuid, text[]) to authenticated;
grant execute on function public.shares_org_with(uuid) to authenticated;
revoke execute on function public.is_org_member(uuid) from public, anon;
revoke execute on function public.has_role(uuid, text[]) from public, anon;
revoke execute on function public.shares_org_with(uuid) from public, anon;

-- Audit log RPC — the ONLY way to insert into audit_logs. Actor and
-- membership are derived server-side (auth.uid()), never trusted from
-- client input, so a caller cannot spoof another user's action or write
-- into an organization they do not belong to.
create or replace function public.log_audit_event(
  p_organization_id uuid,
  p_action text,
  p_entity_type text default null,
  p_entity_id text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_organization_id is not null and not public.is_org_member(p_organization_id) then
    raise exception 'not a member of organization %', p_organization_id;
  end if;

  insert into public.audit_logs (organization_id, actor_id, action, entity_type, entity_id, metadata)
  values (p_organization_id, auth.uid(), p_action, p_entity_type, p_entity_id, coalesce(p_metadata, '{}'::jsonb))
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.log_audit_event(uuid, text, text, text, jsonb) to authenticated;
revoke execute on function public.log_audit_event(uuid, text, text, text, jsonb) from public, anon;

-- ============================================================
-- RLS
-- ============================================================

alter table public.organizations enable row level security;
alter table public.roles enable row level security;
alter table public.profiles enable row level security;
alter table public.organization_members enable row level security;
alter table public.navigation_items enable row level security;
alter table public.audit_logs enable row level security;

-- organizations: members can see their own org(s); no direct writes
-- from client roles (management goes through backend/service role).
create policy organizations_select_member on public.organizations
  for select to authenticated
  using (public.is_org_member(id));

-- roles: small public lookup catalog, readable by any authenticated user.
create policy roles_select_authenticated on public.roles
  for select to authenticated
  using (true);

-- profiles: a user can always see/update their own row, and can see
-- (read-only) profiles of people who share an organization with them.
create policy profiles_select_self on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or public.shares_org_with(id));

create policy profiles_update_self on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- organization_members: members can see their org's roster; only
-- super_admin/direction of that org can manage membership.
create policy organization_members_select on public.organization_members
  for select to authenticated
  using (public.is_org_member(organization_id));

create policy organization_members_insert on public.organization_members
  for insert to authenticated
  with check (public.has_role(organization_id, array['super_admin', 'direction']));

create policy organization_members_update on public.organization_members
  for update to authenticated
  using (public.has_role(organization_id, array['super_admin', 'direction']))
  with check (public.has_role(organization_id, array['super_admin', 'direction']));

create policy organization_members_delete on public.organization_members
  for delete to authenticated
  using (public.has_role(organization_id, array['super_admin', 'direction']));

-- navigation_items: global defaults (organization_id is null) are visible
-- to everyone authenticated; org-scoped items only to that org's members.
-- Only super_admin/direction can create/edit/delete.
create policy navigation_items_select on public.navigation_items
  for select to authenticated
  using (organization_id is null or public.is_org_member(organization_id));

create policy navigation_items_insert on public.navigation_items
  for insert to authenticated
  with check (organization_id is not null and public.has_role(organization_id, array['super_admin', 'direction']));

create policy navigation_items_update on public.navigation_items
  for update to authenticated
  using (organization_id is not null and public.has_role(organization_id, array['super_admin', 'direction']))
  with check (organization_id is not null and public.has_role(organization_id, array['super_admin', 'direction']));

create policy navigation_items_delete on public.navigation_items
  for delete to authenticated
  using (organization_id is not null and public.has_role(organization_id, array['super_admin', 'direction']));

-- audit_logs: readable only by super_admin/direction of the org; no
-- direct insert policy for anyone — writes only via log_audit_event().
create policy audit_logs_select on public.audit_logs
  for select to authenticated
  using (organization_id is not null and public.has_role(organization_id, array['super_admin', 'direction']));

-- ============================================================
-- Seed: role catalog + the real Saturna organization + starter nav.
-- No fake members/users are seeded — org membership is assigned once
-- a real person signs in (see README bootstrap note).
-- ============================================================

insert into public.roles (key, label) values
  ('super_admin', 'Super Admin'),
  ('direction', 'Direction'),
  ('manager', 'Manager'),
  ('employee', 'Employee');

insert into public.organizations (name, slug, status) values
  ('Saturna', 'saturna', 'active');

insert into public.navigation_items (organization_id, title, slug, icon, route, position, enabled)
values
  (null, 'Dashboard', 'dashboard', 'LayoutDashboard', '/dashboard', 0, true),
  (null, 'Organization', 'organization', 'Building2', null, 1, false),
  (null, 'Products', 'products', 'Package', null, 2, false),
  (null, 'Orders', 'orders', 'ShoppingCart', null, 3, false),
  (null, 'Customers', 'customers', 'Users', null, 4, false),
  (null, 'Inventory', 'inventory', 'Boxes', null, 5, false),
  (null, 'Analytics', 'analytics', 'BarChart3', null, 6, false),
  (null, 'Settings', 'settings', 'Settings', null, 7, false);
