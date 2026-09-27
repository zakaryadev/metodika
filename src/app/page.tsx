"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { site, navItems, authorNav } from "@/content/site";
import { categoryTitle } from "@/content/categories";
import { presentations } from "@/content/presentations";
import { methods } from "@/content/methods";
import { games, gameKindGradient, gameKindLabel } from "@/content/games";
import { videos } from "@/content/videos";
import { tasks } from "@/content/tasks";
import { tests } from "@/content/tests";
import { diagnostics } from "@/content/diagnostics";
import { legalDocs } from "@/content/legal";
import { useScript } from "@/lib/script-context";
import { toLatin } from "@/lib/translit";
import { Icon } from "@/components/Icons";
import { accentGradient } from "@/components/ui";
import { ViewCount } from "@/components/ViewCount";
import { OrnamentMedallion, OrnamentTile } from "@/components/Ornament";

const counts: Record<string, number> = {
  "/taqdimotlar": presentations.length,
  "/metodlar": methods.length,
  "/oyinlar": games.length,
  "/videolar": videos.length,
  "/topshiriqlar": tasks.length,
  "/testlar": tests.length,
  "/diagnostika": diagnostics.length,
  "/huquqiy-baza": legalDocs.length,
};

type Hit = { href: string; title: string; section: string };

export default function Home() {
  const { t } = useScript();
  const [q, setQ] = useState("");

  const index: Hit[] = useMemo(
    () => [
      ...presentations.map((p) => ({
        href: `/taqdimotlar/${p.slug}`,
        title: p.title,
        section: "Тақдимот",
      })),
      ...methods.map((m) => ({
        href: `/metodlar/${m.slug}`,
        title: m.title,
        section: "Метод",
      })),
      ...games.map((g) => ({
        href: `/oyinlar/${g.slug}`,
        title: g.title,
        section: "Ўйин",
      })),
      ...videos.map((v) => ({
        href: `/videolar/${v.slug}`,
        title: v.title,
        section: "Видео",
      })),
      ...tasks.map((x) => ({
        href: `/topshiriqlar/${x.slug}`,
        title: x.title,
        section: "Топшириқ",
      })),
      ...tests.map((x) => ({
        href: `/testlar/${x.slug}`,
        title: x.title,
        section: "Тест",
      })),
      ...diagnostics.map((d) => ({
        href: `/diagnostika/${d.slug}`,
        title: d.title,
        section: "Диагностика",
      })),
      ...legalDocs.map((d) => ({
        href: `/huquqiy-baza/${d.slug}`,
        title: d.title,
        section: "Ҳужжат",
      })),
    ],
    [],
  );

  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (s.length < 2) return [];
    const sLat = toLatin(s);
    return index
      .filter((h) => {
        const low = h.title.toLowerCase();
        return low.includes(s) || toLatin(low).includes(sLat);
      })
      .slice(0, 8);
  }, [q, index]);

  const total =
    presentations.length +
    methods.length +
    games.length +
    videos.length +
    tasks.length +
    tests.length +
    diagnostics.length +
    legalDocs.length;

  const stats = [
    { n: presentations.length, label: "тақдимот" },
    { n: methods.length, label: "метод" },
    { n: games.length, label: "ўйин" },
    { n: diagnostics.length, label: "сўровнома" },
    { n: tasks.length, label: "топшириқ" },
    { n: tests.length, label: "тест" },
  ];

  return (
    <>
      {/* ——— Hero ——— */}
      <section className="container-x pt-6">
        {/* overflow-hidden бу ерда бўлиши мумкин эмас: у излаш натижалари
            рўйхатини кесиб қўяди. Шунинг учун безак қатлами ўз ичида
            алоҳида кесилади. */}
        <div className="hero-grad rounded-2xl px-6 py-10 md:px-12 md:py-14 text-white relative">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
            <OrnamentTile size={190} opacity={0.08} />
            <OrnamentMedallion />
          </div>
          <p className="relative text-[11px] font-bold tracking-[0.14em] uppercase opacity-80">
            {t("Методик платформа")} · {site.domain}
          </p>
          <h1 className="relative mt-3 text-3xl md:text-[40px] font-extrabold leading-[1.15] max-w-2xl">
            {t(site.heroTitle)}
          </h1>
          <p className="relative mt-4 text-[15px] md:text-base leading-relaxed max-w-2xl opacity-90">
            {t(site.heroText)}
          </p>

          {/* Излаш */}
          <div className="mt-7 max-w-xl relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Icon name="search" className="w-4.5 h-4.5" />
                </span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("Метод, тақдимот, ўйин, сўровнома…")}
                  aria-label={t("Платформа бўйлаб излаш")}
                  className="w-full rounded-xl bg-white/95 pl-10 pr-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-white/60"
                />
              </div>
            </div>

            {hits.length > 0 && (
              <div className="absolute z-30 mt-2 w-full rounded-xl overflow-hidden shadow-lg animate-pop bg-white">
                {hits.map((h) => (
                  <Link
                    key={h.href}
                    href={h.href}
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 border-b border-slate-100 last:border-0"
                  >
                    <span className="mt-0.5 shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                      {t(h.section)}
                    </span>
                    <span className="text-[13.5px] font-medium text-slate-800 leading-snug">
                      {t(h.title)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
            {q.trim().length >= 2 && hits.length === 0 && (
              <div className="absolute z-30 mt-2 w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-500 shadow-lg animate-pop">
                {t("Ҳеч нарса топилмади")}
              </div>
            )}
          </div>

          {/* Статистика */}
          <div className="relative mt-8 flex flex-wrap gap-x-8 gap-y-4">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-2xl md:text-[28px] font-extrabold leading-none">
                  {s.n}
                </div>
                <div className="mt-1 text-[11.5px] font-medium opacity-80">
                  {t(s.label)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Бўлимлар ——— */}
      <section className="container-x mt-12">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
              {t("Платформа бўлимлари")}
            </h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              {t("Керакли бўлимни танланг — жами")} {total} {t("та материал")}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="card card-hover overflow-hidden focus-ring group"
            >
              <div
                className="relative overflow-hidden px-4 py-5 text-white"
                style={{ background: accentGradient(item.accent) }}
              >
                <OrnamentTile />
                <Icon name={item.icon} className="relative w-7 h-7" />
                <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold">
                  {counts[item.href]}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[15px] leading-snug">
                  {t(item.title)}
                </h3>
                <p
                  className="mt-1.5 text-[13px] leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t(item.description)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Муаллиф картаси */}
        <Link
          href={authorNav.href}
          className="card card-hover mt-4 flex items-center gap-4 p-5 focus-ring"
        >
          <div
            className="flex w-11 h-11 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ background: "var(--grad-brand)" }}
          >
            <Icon name="user" className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-[15px]">{t(authorNav.title)}</h3>
            <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
              {t(authorNav.description)}
            </p>
          </div>
          <Icon name="arrow" className="w-5 h-5 shrink-0" />
        </Link>
      </section>

      {/* ——— Сўнгги тақдимотлар ——— */}
      <section className="container-x mt-12">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
              {t("Тақдимотлар")}
            </h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              {t("Тайёр слайдли дарс материаллари")}
            </p>
          </div>
          <Link
            href="/taqdimotlar"
            className="btn btn-ghost focus-ring shrink-0"
          >
            {t("Барчаси")}
            <Icon name="arrow" className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {presentations.slice(0, 4).map((p) => (
            <Link
              key={p.slug}
              href={`/taqdimotlar/${p.slug}`}
              className="card card-hover overflow-hidden flex flex-col focus-ring"
            >
              <div
                className="relative flex h-24 flex-col justify-center overflow-hidden px-4 text-white"
                style={{ background: "var(--grad-brand)" }}
              >
                <OrnamentTile size={110} opacity={0.1} />
                <Icon name="slides" className="relative w-7 h-7" />
                <span className="relative mt-1.5 text-[11px] font-bold uppercase tracking-wide opacity-90">
                  {t(categoryTitle(p.category))}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-bold text-[14.5px] leading-snug line-clamp-3">
                  {t(p.title)}
                </h3>
                <p
                  className="mt-2 text-[13px] leading-relaxed line-clamp-3 flex-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t(p.description)}
                </p>
                <div
                  className="mt-3 flex items-center gap-3 text-[12px] font-semibold"
                  style={{ color: "var(--text-faint)" }}
                >
                  <span className="flex items-center gap-1.5">
                    <Icon name="slides" className="w-3.5 h-3.5" />
                    {p.slides.length} {t("слайд")}
                  </span>
                  <ViewCount slug={p.slug} fallback={p.views} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ——— Ўйинлар ——— */}
      <section className="container-x mt-12">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
              {t("Интерактив ўйинлар")}
            </h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              {t("Босинг ва дарҳол ўйнанг — рўйхатдан ўтиш шарт эмас")}
            </p>
          </div>
          <Link href="/oyinlar" className="btn btn-ghost focus-ring shrink-0">
            {t("Барчаси")}
            <Icon name="arrow" className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {games.slice(0, 8).map((g) => (
            <Link
              key={g.slug}
              href={`/oyinlar/${g.slug}`}
              className="card card-hover overflow-hidden focus-ring flex flex-col"
            >
              <div
                className="relative flex h-20 items-center gap-2.5 overflow-hidden px-4 text-white"
                style={{ background: gameKindGradient[g.kind] }}
              >
                <OrnamentTile size={100} />
                <Icon name="game" className="relative w-6 h-6 shrink-0" />
                <span className="relative text-[12px] font-bold uppercase tracking-wide">
                  {t(gameKindLabel[g.kind])}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-bold text-[14.5px] leading-snug">
                  {t(g.title)}
                </h3>
                <p
                  className="mt-1.5 text-[13px] leading-relaxed flex-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t(g.description)}
                </p>
                <div
                  className="mt-3 text-[12px] font-semibold"
                  style={{ color: "var(--text-faint)" }}
                >
                  <ViewCount
                    slug={g.slug}
                    fallback={g.plays}
                    label="Неча марта ўйналган"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ——— Диагностика баннери ——— */}
      <section className="container-x mt-12">
        <div
          className="card p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5"
          style={{ background: "var(--brand-light)", borderColor: "transparent" }}
        >
          <div
            className="flex w-12 h-12 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ background: "var(--grad-amber)" }}
          >
            <Icon name="chart" className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg md:text-xl font-extrabold">
              {t("Хавф даражасини аниқланг")}
            </h2>
            <p
              className="mt-1.5 text-sm leading-relaxed max-w-2xl"
              style={{ color: "var(--text-muted)" }}
            >
              {t(
                "Диагностика бўлимидаги сўровномалар натижани дарҳол ҳисоблаб, хавф даражасини ва тавсия этилган иш йўналишини кўрсатади.",
              )}
            </p>
          </div>
          <Link href="/diagnostika" className="btn btn-primary focus-ring shrink-0">
            {t("Сўровномани очиш")}
            <Icon name="arrow" className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
