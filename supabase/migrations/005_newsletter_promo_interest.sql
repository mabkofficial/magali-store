-- Phase 4: newsletter promo interest tracking for routine bundle incentive

alter table public.newsletter_subscribers
  add column if not exists promo_interest boolean not null default false;
