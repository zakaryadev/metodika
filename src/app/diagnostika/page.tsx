"use client";

import Link from "next/link";
import { diagnostics } from "@/content/diagnostics";
import { useScript } from "@/lib/script-context";
import { Icon } from "@/components/Icons";
import {
  CategoryChip,
  CategoryFilter,
  EmptyState,
  PageHero,
  SearchBox,
  useFiltered,
} from "@/components/ui";
import { ViewCount } from "@/components/ViewCount";

export default function DiagnostikaPage() {
  const { t } = useScript();
  const { query, setQuery, cat, setCat, available, filtered } = useFiltered(
    diagnostics,
    (x) => [x.title, x.description, x.audience],
  );

  return (
    <>
      <PageHero
        icon="chart"
        accent="amber"
        title="Диагностика сўровномалари"
        subtitle="Хавф даражасини аниқлаш воситалари. Жавоблар браузердан чиқмайди — натижа шу саҳифанинг ўзида ҳисобланади."
        count={diagnostics.length}
        countLabel="та сўровнома"
      />

      <div className="container-x py-7">
        {/* Этика эслатмаси */}
        <div
          className="card p-4 mb-6 flex gap-3"
          style={{ background: "var(--surface-2)", borderColor: "transparent" }}
        >
          <Icon name="shield" className="w-5 h-5 shrink-0 mt-0.5" />
          <p
            className="text-[13.5px] leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {t(
              "Сўровнома натижаси ташхис эмас — у фақат иш йўналишини белгилайди. Диагностика ихтиёрийлик асосида ўтказилади, натижа махфий сақланади ва ўсмирга ярлиқ сифатида қўлланилмайди. Якуний хулоса камида уч манбадан олинган маълумот асосида чиқарилади.",
            )}
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <div className="max-w-md">
            <SearchBox
              value={query}
              onChange={setQuery}
              placeholder="Сўровнома номи бўйича излаш…"
            />
          </div>
          <CategoryFilter value={cat} onChange={setCat} available={available} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((x) => (
              <Link
                key={x.slug}
                href={`/diagnostika/${x.slug}`}
                className="card card-hover p-5 flex flex-col focus-ring"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="flex w-8 h-8 shrink-0 items-center justify-center rounded-lg text-white"
                    style={{ background: "var(--grad-amber)" }}
                  >
                    <Icon name="chart" className="w-4 h-4" />
                  </span>
                  <CategoryChip id={x.category} />
                </div>
                <h2 className="mt-3 font-bold text-[16px] leading-snug">
                  {t(x.title)}
                </h2>
                <p
                  className="mt-1.5 text-[12.5px] font-semibold"
                  style={{ color: "var(--brand)" }}
                >
                  {t(x.audience)}
                </p>
                <p
                  className="mt-2 text-[13.5px] leading-relaxed flex-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t(x.description)}
                </p>
                <div
                  className="mt-4 flex items-center justify-between text-[12.5px] font-semibold"
                  style={{ color: "var(--text-faint)" }}
                >
                  <span className="flex items-center gap-3">
                    <span>
                      {x.questions.length} {t("кўрсаткич")}
                    </span>
                    <ViewCount slug={x.slug} fallback={x.views} />
                  </span>
                  <span
                    className="flex items-center gap-1"
                    style={{ color: "var(--brand)" }}
                  >
                    {t("Тўлдириш")}
                    <Icon name="arrow" className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
