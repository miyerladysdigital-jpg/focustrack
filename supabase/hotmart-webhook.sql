-- Esquema del webhook de Hotmart (estado final, aplicado en Supabase por migraciones).
-- Referencia para reconstruir el proyecto; la fuente de verdad en producción es la base de datos.

create table if not exists public.processed_events (
  event_id     text primary key,
  event_type   text not null,
  payload_hash text,
  processed_at timestamptz not null default now()
);

create table if not exists public.webhook_log (
  id          bigserial primary key,
  event_id    text,
  type        text,
  result      text not null check (result in ('applied','duplicate','illegal','unauthorized','error')),
  received_at timestamptz not null default now()
);
create index if not exists webhook_log_received_idx on public.webhook_log (received_at desc);

-- Solo el servidor (service role) las usa: RLS activo y sin políticas = anon/authenticated no ven nada.
alter table public.processed_events enable row level security;
alter table public.webhook_log enable row level security;

alter table public.subscriptions drop constraint if exists subscriptions_status_check;
alter table public.subscriptions add constraint subscriptions_status_check
  check (status = any (array['trial','active','past_due','cancelled','expired','refunded','chargeback']));
alter table public.subscriptions add constraint subscriptions_user_id_key unique (user_id);

-- Candado por correo: Hotmart manda varios avisos casi simultáneos; se procesan en fila.
-- Un reembolso/contracargo es terminal para su transacción: un aviso posterior de la MISMA compra
-- no devuelve el acceso; una compra NUEVA (otra transacción) sí es válida.
create or replace function public.apply_hotmart_event(
  p_event_id text, p_event_type text, p_payload_hash text,
  p_email text, p_transaction_id text, p_plan text,
  p_new_status text, p_period_end timestamptz
) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  v_user_id uuid;
  v_current text;
  v_current_tx text;
begin
  perform pg_advisory_xact_lock(hashtext(lower(p_email)));

  select id into v_user_id from auth.users where lower(email) = lower(p_email) limit 1;
  if v_user_id is null then
    return jsonb_build_object('status','no_user');
  end if;

  begin
    insert into public.processed_events (event_id, event_type, payload_hash)
    values (p_event_id, p_event_type, p_payload_hash);
  exception when unique_violation then
    return jsonb_build_object('status','duplicate');
  end;

  select status, hotmart_transaction_id into v_current, v_current_tx
  from public.subscriptions where user_id = v_user_id;

  if v_current in ('refunded','chargeback')
     and p_new_status not in ('refunded','chargeback')
     and p_transaction_id is not distinct from v_current_tx then
    return jsonb_build_object('status','illegal_transition','from',v_current);
  end if;

  insert into public.subscriptions (user_id, plan, status, current_period_end, hotmart_transaction_id)
  values (v_user_id, p_plan, p_new_status, p_period_end, p_transaction_id)
  on conflict (user_id) do update
    set plan = excluded.plan,
        status = excluded.status,
        current_period_end = excluded.current_period_end,
        hotmart_transaction_id = excluded.hotmart_transaction_id,
        updated_at = now();

  update public.profiles
    set plan = p_plan,
        cancelado = (p_new_status in ('cancelled','expired','refunded','chargeback'))
    where id = v_user_id;

  return jsonb_build_object('status','applied','user_id',v_user_id);
end;
$$;

create or replace function public.apply_hotmart_plan_change(
  p_event_id text, p_event_type text, p_payload_hash text,
  p_email text, p_plan text
) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare v_user_id uuid;
begin
  perform pg_advisory_xact_lock(hashtext(lower(p_email)));

  select id into v_user_id from auth.users where lower(email) = lower(p_email) limit 1;
  if v_user_id is null then
    return jsonb_build_object('status','no_user');
  end if;

  begin
    insert into public.processed_events (event_id, event_type, payload_hash)
    values (p_event_id, p_event_type, p_payload_hash);
  exception when unique_violation then
    return jsonb_build_object('status','duplicate');
  end;

  update public.subscriptions set plan = p_plan, updated_at = now() where user_id = v_user_id;
  update public.profiles set plan = p_plan where id = v_user_id;

  return jsonb_build_object('status','applied');
end;
$$;

revoke execute on function public.apply_hotmart_event from public;
revoke execute on function public.apply_hotmart_event from anon, authenticated;
revoke execute on function public.apply_hotmart_plan_change from public;
revoke execute on function public.apply_hotmart_plan_change from anon, authenticated;
