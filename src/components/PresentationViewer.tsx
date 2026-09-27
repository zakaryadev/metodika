"use client";

import { useEffect, useState } from "react";
import { getPresentation } from "@/content/presentations";
import { useScript } from "@/lib/script-context";
import { Icon } from "./Icons";
import { ViewCount } from "./ViewCount";
import { OrnamentTile } from "./Ornament";
import { BackLink, CategoryChip } from "./ui";

export function PresentationViewer({ slug }: { slug: string }) {
  const { t } = useScript();
  const p = getPresentation(slug);
  const [i, setI] = useState(0);
  const [all, setAll] = useState(false);

  const total = p?.slides.length ?? 0;

  const go = (d: number) =>
    setI((v) => Math.min(total - 1, Math.max(0, v + d)));

  useEffect(() => {
    if (all) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setI((v) => Math.min(total - 1, v + 1));
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setI((v) => Math.max(0, v - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total, all]);

  if (!p) return null;

  const slide = p.slides[i];

  return (
    <div className="container-x py-6">
      <div className="no-print">
        <BackLink href="/taqdimotlar" label="Барча тақдимотлар" />
      </div>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <CategoryChip id={p.category} />
          <h1 className="mt-2 text-xl md:text-2xl font-extrabold leading-tight max-w-3xl">
            {t(p.title)}
          </h1>
          <p
            className="mt-1.5 text-sm leading-relaxed max-w-2xl"
            style={{ color: "var(--text-muted)" }}
          >
            {t(p.description)}
          </p>
          <div
            className="mt-2 text-[12.5px] font-semibold"
            style={{ color: "var(--text-faint)" }}
          >
            <ViewCount slug={p.slug} fallback={p.views} register />
          </div>
        </div>
        <div className="flex gap-2 no-print">
          <button
            className="btn btn-ghost focus-ring"
            onClick={() => setAll((v) => !v)}
          >
            <Icon name={all ? "play" : "layers"} className="w-4 h-4" />
            {t(all ? "Слайд режими" : "Барча слайдлар")}
          </button>
          <button className="btn btn-ghost focus-ring" onClick={() => window.print()}>
            <Icon name="print" className="w-4 h-4" />
            <span className="hidden sm:inline">{t("Чоп этиш")}</span>
          </button>
        </div>
      </div>

      {all ? (
        /* ——— Барча слайдлар рўйхати (чоп этишга мос) ——— */
        <div className="mt-6 space-y-4">
          {p.slides.map((s, idx) => (
            <article key={idx} className="card p-6">
              <div
                className="text-[11px] font-bold uppercase tracking-wide"
                style={{ color: "var(--text-faint)" }}
              >
                {t("Слайд")} {idx + 1} / {total}
              </div>
              <h2 className="mt-1.5 text-lg font-extrabold">{t(s.title)}</h2>
              <ul className="mt-3 space-y-2">
                {s.bullets.map((b, bi) => (
                  <li key={bi} className="flex gap-2.5 text-[14.5px] leading-relaxed">
                    <span
                      className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: "var(--brand)" }}
                    />
                    <span>{t(b)}</span>
                  </li>
                ))}
              </ul>
              {s.note && (
                <p
                  className="mt-4 rounded-lg px-3.5 py-2.5 text-[13.5px] leading-relaxed"
                  style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
                >
                  {t(s.note)}
                </p>
              )}
            </article>
          ))}
        </div>
      ) : (
        <>
          {/* ——— Слайд ——— */}
          <div
            className="card mt-6 overflow-hidden"
            style={{ minHeight: "clamp(340px, 52vh, 520px)" }}
          >
            <div className="hero-grad relative overflow-hidden px-6 py-5 text-white">
              <OrnamentTile size={110} opacity={0.1} />
              <div className="relative text-[11px] font-bold uppercase tracking-[0.12em] opacity-80">
                {t("Слайд")} {i + 1} / {total}
              </div>
              <h2 className="relative mt-1 text-xl md:text-2xl font-extrabold leading-tight">
                {t(slide.title)}
              </h2>
            </div>

            <div className="p-6 md:p-8">
              <ul className="space-y-3.5">
                {slide.bullets.map((b, bi) => (
                  <li
                    key={bi}
                    className="flex gap-3 text-[15px] md:text-[16.5px] leading-relaxed"
                  >
                    <span
                      className="mt-1 flex w-6 h-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                      style={{ background: "var(--brand-light)", color: "var(--brand)" }}
                    >
                      {bi + 1}
                    </span>
                    <span>{t(b)}</span>
                  </li>
                ))}
              </ul>

              {slide.note && (
                <div
                  className="mt-6 flex gap-3 rounded-xl px-4 py-3.5"
                  style={{ background: "var(--surface-2)" }}
                >
                  <Icon
                    name="lightbulb"
                    className="w-5 h-5 shrink-0 mt-0.5"
                    />
                  <p
                    className="text-[14px] leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t(slide.note)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ——— Навигация ——— */}
          <div className="mt-4 flex items-center gap-3 no-print">
            <button
              className="btn btn-ghost focus-ring"
              onClick={() => go(-1)}
              disabled={i === 0}
            >
              <Icon name="back" className="w-4 h-4" />
              {t("Олдинги")}
            </button>

            <div className="flex-1 flex flex-wrap gap-1.5 justify-center">
              {p.slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  aria-label={`${t("Слайд")} ${idx + 1}`}
                  className="h-2 rounded-full transition-all focus-ring"
                  style={{
                    width: idx === i ? 26 : 10,
                    background: idx === i ? "var(--brand)" : "var(--border-strong)",
                  }}
                />
              ))}
            </div>

            <button
              className="btn btn-primary focus-ring"
              onClick={() => go(1)}
              disabled={i === total - 1}
            >
              {t("Кейинги")}
              <Icon name="arrow" className="w-4 h-4" />
            </button>
          </div>

          <p
            className="mt-3 text-center text-xs no-print"
            style={{ color: "var(--text-faint)" }}
          >
            {t("Клавиатурадаги ← → тугмалари билан ҳам бошқариш мумкин")}
          </p>
        </>
      )}
    </div>
  );
}
