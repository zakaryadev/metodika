"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { legalDocs } from "@/content/legal";
import { useScript } from "@/lib/script-context";
import { toLatin } from "@/lib/translit";
import { Icon } from "@/components/Icons";
import { EmptyState, PageHero, SearchBox } from "@/components/ui";

export default function HuquqiyBazaPage() {
  const { t } = useScript();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return legalDocs;
    const qLat = toLatin(q);
    return legalDocs.filter((d) => {
      const hay = `${d.title} ${d.summary} ${d.kind} ${d.number ?? ""}`.toLowerCase();
      return hay.includes(q) || toLatin(hay).includes(qLat);
    });
  }, [query]);

  return (
    <>
      <PageHero
        icon="scale"
        accent="indigo"
        title="Ҳуқуқий-норматив база"
        subtitle="Вояга етмаганлар билан профилактик ишни тартибга солувчи асосий қонун ва ҳужжатлар"
        count={legalDocs.length}
        countLabel="та ҳужжат"
      />

      <div className="container-x py-7">
        <div
          className="card p-4 mb-6 flex gap-3"
          style={{ background: "var(--surface-2)", borderColor: "transparent" }}
        >
          <Icon name="lightbulb" className="w-5 h-5 shrink-0 mt-0.5" />
          <p
            className="text-[13.5px] leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {t(
              "Қуйидаги маълумотлар танишиш учун мўлжалланган. Ҳужжатга ўзгартиришлар киритилган бўлиши мумкин — расмий матнни lex.uz сайтидан текшириб кўринг.",
            )}
          </p>
        </div>

        <div className="max-w-md mb-6">
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="Ҳужжат номи ёки рақами бўйича излаш…"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {filtered.map((d) => (
              <Link
                key={d.slug}
                href={`/huquqiy-baza/${d.slug}`}
                className="card card-hover p-5 flex gap-4 focus-ring"
              >
                <span
                  className="hidden sm:flex w-10 h-10 shrink-0 items-center justify-center rounded-lg text-white"
                  style={{ background: "var(--grad-indigo)" }}
                >
                  <Icon name="scale" className="w-5 h-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip">{t(d.kind)}</span>
                    {d.number && d.date ? (
                      <span
                        className="text-[12px] font-bold"
                        style={{ color: "var(--text-faint)" }}
                      >
                        {t(d.number)} · {t(d.date)}
                      </span>
                    ) : (
                      <span
                        className="rounded-full px-2 py-0.5 text-[11px] font-bold"
                        style={{
                          background:
                            "color-mix(in srgb, var(--warn) 16%, transparent)",
                          color: "var(--warn)",
                        }}
                      >
                        {t("реквизитлар аниқланмаган")}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 font-bold text-[15.5px] leading-snug">
                    {t(d.title)}
                  </h2>
                  <p
                    className="mt-1.5 text-[13.5px] leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t(d.summary)}
                  </p>
                </div>
                <Icon
                  name="arrow"
                  className="w-5 h-5 shrink-0 self-center hidden sm:block"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
