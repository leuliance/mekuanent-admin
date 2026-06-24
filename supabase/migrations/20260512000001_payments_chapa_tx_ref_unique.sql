-- ============================================================================
-- Chapa payments — enforce one row per tx_ref, defense-in-depth
-- ----------------------------------------------------------------------------
-- The chapa-payment edge function already tries to be idempotent against
-- `payment_details->>'tx_ref'` by checking before inserting, but a verify
-- call from the client and Chapa's webhook can hit the function in
-- parallel. Both pass the SELECT, both succeed at INSERT, and we end up
-- with two payment rows (and two donations) for a single user payment.
--
-- This migration:
--   1. Cleans up any duplicate payment + donation rows that already
--      exist (keeping the oldest of each tx_ref).
--   2. Adds a partial unique index on `gateway_transaction_id` for chapa
--      payments so a future race surfaces as a 23505 unique_violation
--      that the edge function can catch and reconcile to the surviving
--      row.
-- ============================================================================

-- 1. Dedupe donations BEFORE payments (donations.payment_id FKs payments).
--    For each set of duplicates linked to the same tx_ref payment cluster,
--    keep the earliest-created donation and delete the rest.
with chapa_payments as (
    select id,
           gateway_transaction_id,
           created_at,
           row_number() over (
               partition by gateway_transaction_id
               order by created_at asc, id asc
           ) as rn
    from public.payments
    where payment_gateway = 'chapa'
      and gateway_transaction_id is not null
),
duplicate_payment_ids as (
    select id from chapa_payments where rn > 1
)
delete from public.donations
where payment_id in (select id from duplicate_payment_ids);

-- 2. Now drop the duplicate payment rows themselves.
with chapa_payments as (
    select id,
           gateway_transaction_id,
           created_at,
           row_number() over (
               partition by gateway_transaction_id
               order by created_at asc, id asc
           ) as rn
    from public.payments
    where payment_gateway = 'chapa'
      and gateway_transaction_id is not null
)
delete from public.payments
where id in (select id from chapa_payments where rn > 1);

-- 3. Enforce one chapa payment per gateway tx_ref. Partial index so other
--    gateways (which may not produce a tx_ref or may legitimately reuse
--    one) are unaffected.
create unique index if not exists payments_chapa_tx_ref_uniq
    on public.payments (gateway_transaction_id)
    where payment_gateway = 'chapa'
      and gateway_transaction_id is not null;

comment on index public.payments_chapa_tx_ref_uniq is
    'One chapa payment per gateway tx_ref. Surfaces verify/webhook races as 23505 so the edge function can reconcile to the surviving row instead of duplicating donations.';

-- 4. Same defense for donations. Even after step 3 collapses payments to
--    a single row per tx_ref, the verify and webhook callers can both
--    pass the "does a donation already exist for this payment?" SELECT
--    before either INSERT lands. A unique index on `payment_id` makes
--    the loser's INSERT fail with 23505, which the edge function then
--    treats the same as "already inserted".
create unique index if not exists donations_payment_id_uniq
    on public.donations (payment_id)
    where payment_id is not null;

comment on index public.donations_payment_id_uniq is
    'One donation per payment row. Backstops verify/webhook races for chapa donations so the donor list never shows the same gift twice.';
