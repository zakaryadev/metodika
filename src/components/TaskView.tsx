"use client";

import { useState } from "react";
import { getTask } from "@/content/tasks";
import { useScript } from "@/lib/script-context";
import { Icon } from "./Icons";
import { ViewCount } from "./ViewCount";
import { BackLink, CategoryChip } from "./ui";

export function TaskView({ slug }: { slug: string }) {
  const { t } = useScript();
  const x = getTask(slug);
  const [showHints, setShowHints] = useState(false);
  const [answer, setAnswer] = useState("");

  if (!x) return null;

  return (
    <div className="container-x py-6">
      <div className="no-print">
        <BackLink href="/topshiriqlar" label="Барча вазиятлар" />
      </div>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-3xl">
          <CategoryChip id={x.category} />
          <h1 className="mt-2 text-xl md:text-2xl font-extrabold leading-tight">
            {t(x.title)}
          </h1>
          <div
            className="mt-2 text-[12.5px] font-semibold"
            style={{ color: "var(--text-faint)" }}
          >
            <ViewCount slug={x.slug} fallback={x.views} register />
          </div>
        </div>
        <button
          className="btn btn-ghost focus-ring no-print shrink-0"
          onClick={() => window.print()}
        >
          <Icon name="print" className="w-4 h-4" />
          <span className="hidden sm:inline">{t("Чоп этиш")}</span>
        </button>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          {/* Вазият */}
          <section className="card p-6">
            <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide" style={{ color: "var(--text-faint)" }}>
              <Icon name="task" className="w-4 h-4" />
              {t("Вазият")}
            </h2>
            <p className="mt-3 text-[15px] md:text-[16px] leading-relaxed">
              {t(x.situation)}
            </p>
          </section>

          {/* Топшириқ */}
          <section
            className="card p-6"
            style={{ background: "var(--brand-light)", borderColor: "transparent" }}
          >
            <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide" style={{ color: "var(--text-faint)" }}>
              <Icon name="target" className="w-4 h-4" />
              {t("Топшириқ")}
            </h2>
            <p className="mt-3 text-[15px] font-semibold leading-relaxed">
              {t(x.assignment)}
            </p>
          </section>

          {/* Ёзув майдони */}
          <section className="card p-6 no-print">
            <h2 className="flex items-center gap-2 font-bold text-[15px]">
              <Icon name="book" className="w-4.5 h-4.5" />
              {t("Жавобингизни ёзинг")}
            </h2>
            <p
              className="mt-1.5 text-[12.5px]"
              style={{ color: "var(--text-faint)" }}
            >
              {t("Матн фақат сизнинг браузерингизда қолади ва ҳеч қаерга юборилмайди")}
            </p>
            <textarea
              className="input mt-3 min-h-44 resize-y leading-relaxed"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={t("Таҳлил ва ечимингизни шу ерга ёзинг…")}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                className="btn btn-ghost focus-ring"
                onClick={() => setAnswer("")}
                disabled={!answer}
              >
                <Icon name="restart" className="w-4 h-4" />
                {t("Тозалаш")}
              </button>
              <button
                className="btn btn-ghost focus-ring"
                onClick={() => {
                  const blob = new Blob([`${x.title}\n\n${answer}`], {
                    type: "text/plain;charset=utf-8",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${x.slug}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                disabled={!answer.trim()}
              >
                <Icon name="download" className="w-4 h-4" />
                {t("Файл сифатида сақлаш")}
              </button>
            </div>
          </section>
        </div>

        {/* Кўрсатмалар */}
        <aside className="no-print">
          <div className="card p-5">
            <h2 className="flex items-center gap-2 font-bold text-[15px]">
              <Icon name="lightbulb" className="w-4.5 h-4.5" />
              {t("Ёрдамчи кўрсатмалар")}
            </h2>
            <p
              className="mt-1.5 text-[12.5px] leading-relaxed"
              style={{ color: "var(--text-faint)" }}
            >
              {t("Аввал мустақил ўйлаб кўринг, сўнг кўрсатмаларни очинг")}
            </p>

            {showHints ? (
              <ul className="mt-3 space-y-2.5 animate-pop">
                {x.hints.map((h, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span
                      className="flex w-6 h-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                      style={{ background: "var(--brand-light)", color: "var(--brand)" }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="text-[13.5px] leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {t(h)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <button
                className="btn btn-soft focus-ring mt-3 w-full"
                onClick={() => setShowHints(true)}
              >
                <Icon name="eye" className="w-4 h-4" />
                {t("Кўрсатмаларни очиш")} ({x.hints.length})
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
