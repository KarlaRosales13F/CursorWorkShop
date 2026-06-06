-- Atomic fake-money buy: deduct balance, upsert position, insert ledger entry.
-- Uses auth.uid() for authorization; clients cannot pass user_id.

create or replace function public.buy_market_shares(
  p_market_id uuid,
  p_side text,
  p_amount_cents bigint
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_balance bigint;
  v_market record;
  v_yes_shares bigint;
  v_no_shares bigint;
  v_description text;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if p_amount_cents is null or p_amount_cents <= 0 then
    raise exception 'Amount must be a positive integer of fake cents';
  end if;

  if p_side not in ('yes', 'no') then
    raise exception 'Side must be yes or no';
  end if;

  select id, status, close_date
  into v_market
  from public.markets
  where id = p_market_id;

  if not found then
    raise exception 'Market not found';
  end if;

  if v_market.status <> 'open' then
    raise exception 'Market is not open for buying';
  end if;

  if v_market.close_date is not null and v_market.close_date <= now() then
    raise exception 'Market has passed its close date';
  end if;

  select balance_cents
  into v_balance
  from public.profiles
  where id = v_user_id
  for update;

  if not found then
    raise exception 'Profile not found';
  end if;

  if v_balance < p_amount_cents then
    raise exception 'Insufficient fake balance';
  end if;

  update public.profiles
  set balance_cents = balance_cents - p_amount_cents
  where id = v_user_id;

  if p_side = 'yes' then
    v_description := 'Buy Yes';

    insert into public.positions (user_id, market_id, yes_shares_cents, no_shares_cents)
    values (v_user_id, p_market_id, p_amount_cents, 0)
    on conflict (user_id, market_id) do update
      set yes_shares_cents = positions.yes_shares_cents + excluded.yes_shares_cents;
  else
    v_description := 'Buy No';

    insert into public.positions (user_id, market_id, yes_shares_cents, no_shares_cents)
    values (v_user_id, p_market_id, 0, p_amount_cents)
    on conflict (user_id, market_id) do update
      set no_shares_cents = positions.no_shares_cents + excluded.no_shares_cents;
  end if;

  insert into public.ledger_entries (
    user_id,
    market_id,
    amount_cents,
    entry_type,
    description
  )
  values (
    v_user_id,
    p_market_id,
    -p_amount_cents,
    'trade',
    v_description
  );

  select yes_shares_cents, no_shares_cents
  into v_yes_shares, v_no_shares
  from public.positions
  where user_id = v_user_id
    and market_id = p_market_id;

  return jsonb_build_object(
    'balance_cents', v_balance - p_amount_cents,
    'yes_shares_cents', v_yes_shares,
    'no_shares_cents', v_no_shares
  );
end;
$$;

grant execute on function public.buy_market_shares(uuid, text, bigint) to authenticated;
