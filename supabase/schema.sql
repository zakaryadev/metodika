-- ═══════════════════════════════════════════════════════════════
--  Кўришлар ҳисоблагичи (счётчик просмотров)
--
--  Ўрнатиш: Supabase панелида SQL Editor ни очинг, шу файлнинг
--  бутун мазмунини нусхалаб қўйинг ва Run тугмасини босинг.
--  Қайта ишга тушириш хавфсиз — мавжуд маълумот ўчмайди.
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.views (
  slug       text primary key,
  count      integer     not null default 0,
  updated_at timestamptz not null default now()
);

-- Сатрлар даражасидаги хавфсизлик
alter table public.views enable row level security;

-- Ҳамма ўқий олади
drop policy if exists "views_public_read" on public.views;
create policy "views_public_read"
  on public.views
  for select
  using (true);

-- Тўғридан-тўғри ёзиш сиёсати берилмайди: ҳисоблагич фақат
-- қуйидаги функция орқали оширилади.

create or replace function public.increment_view(p_slug text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count integer;
begin
  -- Оддий текширув: бўш ёки ҳаддан ташқари узун калитга йўл қўймаймиз
  if p_slug is null or length(p_slug) = 0 or length(p_slug) > 120 then
    raise exception 'invalid slug';
  end if;

  insert into public.views as v (slug, count, updated_at)
  values (p_slug, 1, now())
  on conflict (slug) do update
    set count = v.count + 1,
        updated_at = now()
  returning v.count into new_count;

  return new_count;
end;
$$;

-- Функцияни рўйхатдан ўтмаган фойдаланувчилар ҳам чақира олади
grant execute on function public.increment_view(text) to anon, authenticated;

-- ── Ихтиёрий: бошланғич сонларни қўйиш ────────────────────────
-- Агар ҳисоблагичларни нолдан эмас, маълум сондан бошламоқчи
-- бўлсангиз, қуйидагига ўхшаш сатрларни ишга туширинг:
--
-- insert into public.views (slug, count) values
--   ('profilaktika-pedagogik-asoslari', 52),
--   ('deviant-xulq-sabablari', 47)
-- on conflict (slug) do update set count = excluded.count;
