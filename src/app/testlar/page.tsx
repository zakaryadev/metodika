"use client";

import Link from "next/link";
import { tests } from "@/content/tests";
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

export default function TestlarPage() {
  const { t } = useScript();
  const { query, setQuery, cat, setCat, available, filtered } = useFiltered(
    tests,
    (x) => [x.title, x.description],
  );

  return (
    <>
      <PageHero
        icon="test"
        accent="cyan"
        title="Тест синовлари"
        subtitle="Билимни текшириш учун тайёр тестлар — натижа дарҳол ҳисобланади ва ҳар бир савол изоҳ билан таҳлил қилинади"
        count={tests.length}
        countLabel="та тест"
      />

      <div className="container-x py-7">
        <div className="flex flex-col gap-3 mb-6">
          <div className="max-w-md">
            <SearchBox
              value={query}
              onChange={setQuery}
              placeholder="Тест номи бўйича излаш…"
            />
          </div>
          <CategoryFilter value={cat} onChange={setCat} available={available} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((x) => (
              <Link
                key={x.slug}
                href={`/testlar/${x.slug}`}
                className="card card-hover p-5 flex flex-col focus-ring"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="flex w-8 h-8 shrink-0 items-center justify-center rounded-lg text-white"
                    style={{ background: "var(--grad-cyan)" }}
                  >
                    <Icon name="test" className="w-4 h-4" />
                  </span>
                  <CategoryChip id={x.category} />
                </div>
                <h2 className="mt-3 font-bold text-[15.5px] leading-snug">
                  {t(x.title)}
                </h2>
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
                      {x.questions.length} {t("савол")}
                    </span>
                    <ViewCount slug={x.slug} fallback={x.views} />
                  </span>
                  <span
                    className="flex items-center gap-1"
                    style={{ color: "var(--brand)" }}
                  >
                    {t("Бошлаш")}
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
