-- HISHCHENIE / THEFT — REVIVAL R6
-- Unique visible aliases for audience profiles.
-- Apply once to project xltwwvutqkpmtmlavngi.
-- Existing official profile is deliberately excluded.

create unique index if not exists profiles_unique_alias_identity_idx
on public.profiles ((
  case
    when alias_code is null or btrim(alias_code) = '' or alias_code = 'official_team' then null
    when alias_code = 'record'
      or alias_code ~ '^(role_|world_|noun_|sr_|node_|gate_|curated_)'
      then alias_code || ':' || coalesce(alias_number,0)::text
    else alias_code
  end
))
where alias_code is not null
  and btrim(alias_code) <> ''
  and alias_code <> 'official_team';

comment on index public.profiles_unique_alias_identity_idx is
'REVIVAL R6: one active audience profile per rendered alias identity; numbered legacy schemes and curated aliases include alias_number.';
