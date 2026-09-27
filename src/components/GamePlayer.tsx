"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { games, getGame, gameKindLabel } from "@/content/games";
import { useScript } from "@/lib/script-context";
import { Icon } from "./Icons";
import { ViewCount } from "./ViewCount";
import { BackLink, CategoryChip } from "./ui";

/**
 * Ўйинлар фақат мижозда юкланади: уларнинг ҳолати тасодифий
 * аралаштиришга асосланган, шунинг учун серверда рендер қилинмайди.
 */
const Engine = dynamic(() => import("./games/Engine"), {
  ssr: false,
  loading: () => (
    <div
      className="card flex items-center justify-center"
      style={{ minHeight: 280 }}
    >
      <span
        className="text-[13px] font-semibold"
        style={{ color: "var(--text-faint)" }}
      >
        …
      </span>
    </div>
  ),
});

export function GamePlayer({ slug }: { slug: string }) {
  const { t, script } = useScript();
  const game = getGame(slug);
  if (!game) return null;

  return (
    <div className="container-x py-6">
      <BackLink href="/oyinlar" label="Барча ўйинлар" />

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold text-white"
              style={{ background: "var(--grad-emerald)" }}
            >
              <Icon name="game" className="w-3.5 h-3.5" />
              {t(gameKindLabel[game.kind])}
            </span>
            <CategoryChip id={game.category} />
          </div>
          <h1 className="mt-2.5 text-xl md:text-2xl font-extrabold leading-tight">
            {t(game.title)}
          </h1>
          <p
            className="mt-1.5 text-[14.5px] leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {t(game.instruction)}
          </p>
          <div
            className="mt-2 text-[12.5px] font-semibold"
            style={{ color: "var(--text-faint)" }}
          >
            <ViewCount
              slug={game.slug}
              fallback={game.plays}
              label="Неча марта ўйналган"
              register
            />
          </div>
        </div>
      </div>

      {/* key={script} — ёзув алмашганда ўйин янги ёзувда қайта бошланади */}
      <div className="mt-6 max-w-4xl">
        <Engine key={script} game={game} />
      </div>

      <OtherGames current={game.slug} />
    </div>
  );
}

function OtherGames({ current }: { current: string }) {
  const { t } = useScript();
  const others = games.filter((g) => g.slug !== current).slice(0, 4);

  return (
    <section className="mt-12">
      <h2 className="text-lg font-extrabold mb-4">{t("Бошқа ўйинлар")}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {others.map((g) => (
          <Link
            key={g.slug}
            href={`/oyinlar/${g.slug}`}
            className="card card-hover p-4 focus-ring"
          >
            <span className="chip">{t(gameKindLabel[g.kind])}</span>
            <h3 className="mt-2 font-bold text-[14px] leading-snug">
              {t(g.title)}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
