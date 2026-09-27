"use client";

import Link from "next/link";
import { tasks } from "@/content/tasks";
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

export default function TopshiriqlarPage() {
  const { t } = useScript();
  const { query, setQuery, cat, setCat, available, filtered } = useFiltered(
    tasks,
    (x) => [x.title, x.situation, x.assignment],
  );

  return (
    <>
      <PageHero
        icon="task"
        accent="rose"
        title="Вазиятли топшириқлар"
        subtitle="Амалий педагогик вазиятлар — ҳар бири таҳлил топшириғи ва ёрдамчи кўрсатмалар билан"
        count={tasks.length}
        countLabel="та вазият"
      />

      <div className="container-x py-7">
        <div className="flex flex-col gap-3 mb-6">
          <div className="max-w-md">
            <SearchBox
              value={query}
              onChange={setQuery}
              placeholder="Вазият номи бўйича излаш…"
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
                href={`/topshiriqlar/${x.slug}`}
                className="card card-hover p-5 flex flex-col focus-ring"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="flex w-8 h-8 shrink-0 items-center justify-center rounded-lg text-white"
                    style={{ background: "var(--grad-rose)" }}
                  >
                    <Icon name="task" className="w-4 h-4" />
                  </span>
                  <CategoryChip id={x.category} />
                </div>
                <h2 className="mt-3 font-bold text-[16px] leading-snug">
                  {t(x.title)}
                </h2>
                <p
                  className="mt-2 text-[13.5px] leading-relaxed line-clamp-3 flex-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t(x.situation)}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span
                    className="inline-flex items-center gap-1.5 text-[13px] font-bold"
                    style={{ color: "var(--brand)" }}
                  >
                    {t("Вазиятни очиш")}
                    <Icon name="arrow" className="w-4 h-4" />
                  </span>
                  <span
                    className="text-[12.5px] font-semibold"
                    style={{ color: "var(--text-faint)" }}
                  >
                    <ViewCount slug={x.slug} fallback={x.views} />
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
