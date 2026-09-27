"use client";

import Link from "next/link";
import { methods } from "@/content/methods";
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

export default function MetodlarPage() {
  const { t } = useScript();
  const { query, setQuery, cat, setCat, available, filtered } = useFiltered(
    methods,
    (m) => [m.title, m.summary, m.goal],
  );

  return (
    <>
      <PageHero
        icon="book"
        accent="violet"
        title="Методик қўлланмалар"
        subtitle="Интерактив педагогик методлар — мақсади, босқичлари ва кутилаётган натижаси билан"
        count={methods.length}
        countLabel="та метод"
      />

      <div className="container-x py-7">
        <div className="flex flex-col gap-3 mb-6">
          <div className="max-w-md">
            <SearchBox
              value={query}
              onChange={setQuery}
              placeholder="Метод номи бўйича излаш…"
            />
          </div>
          <CategoryFilter value={cat} onChange={setCat} available={available} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m) => (
              <Link
                key={m.slug}
                href={`/metodlar/${m.slug}`}
                className="card card-hover p-5 flex flex-col focus-ring"
              >
                <CategoryChip id={m.category} />
                <h2 className="mt-3 font-bold text-[16px] leading-snug">
                  {t(m.title)}
                </h2>
                <p
                  className="mt-2 text-[13.5px] leading-relaxed flex-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t(m.summary)}
                </p>
                <div
                  className="mt-4 flex items-center gap-3 text-[12.5px] font-semibold flex-wrap"
                  style={{ color: "var(--text-faint)" }}
                >
                  <span className="flex items-center gap-1.5">
                    <Icon name="layers" className="w-4 h-4" />
                    {m.steps.length} {t("босқич")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="clock" className="w-4 h-4" />
                    {t(m.duration)}
                  </span>
                  <ViewCount slug={m.slug} fallback={m.views} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
