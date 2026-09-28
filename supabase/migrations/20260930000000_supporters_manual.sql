-- Pledges now come in through a Google Form; editors add confirmed supporters by hand, so contact is optional.
alter table public.supporters alter column contact drop not null;
