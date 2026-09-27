"use client";

import Link from "next/link";
import { presentations } from "@/content/presentations";
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

export default function TaqdimotlarPage() {
  const { t } = useScript();
  const { query, setQuery, cat, setCat, available, filtered } = useFiltered(
    presentations,
    (p) => [p.title, p.description],
  );

  return (
    <>
      <PageHero
        icon="slides"
        accent="blue"
        title="Тақдимотлар"
        subtitle="Профилактика, девиант хулқ ва ҳуқуқий тарбия мавзуларида тайёр слайдли дарслар"
        count={presentations.length}
        countLabel="та тақдимот"
      />

      <div className="container-x py-7">
        <div className="flex flex-col gap-3 mb-6">
          <div className="max-w-md">
            <SearchBox
              value={query}
              onChange={setQuery}
              placeholder="Тақдимот номи бўйича излаш…"
            />
          </div>
          <CategoryFilter value={cat} onChange={setCat} available={available} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <Link
                key={p.slug}
                href={`/taqdimotlar/${p.slug}`}
                className="card card-hover p-5 flex flex-col focus-ring"
              >
                <CategoryChip id={p.category} />
                <h2 className="mt-3 font-bold text-[16px] leading-snug">
                  {t(p.title)}
                </h2>
                <p
                  className="mt-2 text-[13.5px] leading-relaxed flex-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t(p.description)}
                </p>
                <div
                  className="mt-4 flex items-center justify-between text-[12.5px] font-semibold"
                  style={{ color: "var(--text-faint)" }}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <Icon name="slides" className="w-4 h-4" />
                      {p.slides.length} {t("слайд")}
                    </span>
                    <ViewCount slug={p.slug} fallback={p.views} />
                  </span>
                  <span
                    className="flex items-center gap-1"
                    style={{ color: "var(--brand)" }}
                  >
                    {t("Очиш")}
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
