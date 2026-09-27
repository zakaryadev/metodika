"use client";

import Link from "next/link";
import { games, gameKindGradient, gameKindLabel } from "@/content/games";
import { useScript } from "@/lib/script-context";
import { Icon } from "@/components/Icons";
import { OrnamentTile } from "@/components/Ornament";
import {
  CategoryFilter,
  EmptyState,
  PageHero,
  SearchBox,
  useFiltered,
} from "@/components/ui";
import { ViewCount } from "@/components/ViewCount";

export default function OyinlarPage() {
  const { t } = useScript();
  const { query, setQuery, cat, setCat, available, filtered } = useFiltered(
    games,
    (g) => [g.title, g.description, gameKindLabel[g.kind]],
  );

  return (
    <>
      <PageHero
        icon="game"
        accent="emerald"
        title="Интерактив ўйинлар"
        subtitle="Босинг ва дарҳол ўйнанг — рўйхатдан ўтиш шарт эмас. Ҳар бир ўйин дарсда ёки тренингда ишлатишга тайёр."
        count={games.length}
        countLabel="та ўйин"
      />

      <div className="container-x py-7">
        <div className="flex flex-col gap-3 mb-6">
          <div className="max-w-md">
            <SearchBox
              value={query}
              onChange={setQuery}
              placeholder="Ўйин номи ёки тури бўйича излаш…"
            />
          </div>
          <CategoryFilter value={cat} onChange={setCat} available={available} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((g) => (
              <Link
                key={g.slug}
                href={`/oyinlar/${g.slug}`}
                className="card card-hover overflow-hidden focus-ring flex flex-col"
              >
                <div
                  className="relative flex items-center gap-2.5 overflow-hidden px-4 py-3.5 text-white"
                  style={{ background: gameKindGradient[g.kind] }}
                >
                  <OrnamentTile />
                  <Icon name="game" className="relative w-5 h-5 shrink-0" />
                  <span className="relative text-[12px] font-bold uppercase tracking-wide">
                    {t(gameKindLabel[g.kind])}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h2 className="font-bold text-[15.5px] leading-snug">
                    {t(g.title)}
                  </h2>
                  <p
                    className="mt-1.5 text-[13.5px] leading-relaxed flex-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t(g.description)}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className="inline-flex items-center gap-1.5 text-[13px] font-bold"
                      style={{ color: "var(--brand)" }}
                    >
                      <Icon name="play" className="w-3.5 h-3.5" />
                      {t("Ўйнаш")}
                    </span>
                    <span
                      className="text-[12.5px] font-semibold"
                      style={{ color: "var(--text-faint)" }}
                    >
                      <ViewCount
                        slug={g.slug}
                        fallback={g.plays}
                        label="Неча марта ўйналган"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
