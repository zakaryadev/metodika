"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getDiagnostic } from "@/content/diagnostics";
import { useScript } from "@/lib/script-context";
import { Icon } from "./Icons";
import { ViewCount } from "./ViewCount";
import { BackLink, CategoryChip } from "./ui";

export function DiagnosticRunner({ slug }: { slug: string }) {
  const { t } = useScript();
  const d = getDiagnostic(slug);

  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [done, setDone] = useState(false);
  const [label, setLabel] = useState("");

  const maxScore = useMemo(
    () =>
      d ? d.questions.length * Math.max(...d.scale.map((s) => s.value)) : 0,
    [d],
  );

  const score = useMemo(
    () => Object.values(answers).reduce((a, b) => a + b, 0),
    [answers],
  );

  if (!d) return null;

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === d.questions.length;
  const band =
    d.bands.find((b) => score >= b.min && score <= b.max) ??
    d.bands[d.bands.length - 1];

  const reset = () => {
    setAnswers({});
    setDone(false);
    setStarted(false);
    setLabel("");
  };

  /* ——— Кириш экрани ——— */
  if (!started) {
    return (
      <div className="container-x py-6 max-w-2xl">
        <BackLink href="/diagnostika" label="Барча сўровномалар" />
        <div className="card p-7 mt-4">
          <span
            className="flex w-14 h-14 items-center justify-center rounded-2xl text-white"
            style={{ background: "var(--grad-amber)" }}
          >
            <Icon name="chart" className="w-7 h-7" />
          </span>
          <div className="mt-4">
            <CategoryChip id={d.category} />
          </div>
          <h1 className="mt-3 text-xl md:text-2xl font-extrabold leading-tight">
            {t(d.title)}
          </h1>
          <p
            className="mt-1.5 text-[13.5px] font-bold"
            style={{ color: "var(--brand)" }}
          >
            {t(d.audience)}
          </p>
          <p
            className="mt-3 text-[14.5px] leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {t(d.description)}
          </p>

          <div
            className="mt-5 rounded-xl px-4 py-3.5"
            style={{ background: "var(--surface-2)" }}
          >
            <h2 className="flex items-center gap-2 text-[13px] font-bold">
              <Icon name="lightbulb" className="w-4 h-4" />
              {t("Кўрсатма")}
            </h2>
            <p
              className="mt-1.5 text-[13.5px] leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {t(d.instruction)}
            </p>
          </div>

          <div className="mt-4">
            <label
              className="block text-[12.5px] font-bold mb-1.5"
              style={{ color: "var(--text-faint)" }}
            >
              {t("Ким бўйича тўлдирилмоқда (ихтиёрий)")}
            </label>
            <input
              className="input"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={t("Масалан: 8-А синф, ўқувчи Ш.")}
            />
            <p
              className="mt-1.5 text-[12px] leading-relaxed"
              style={{ color: "var(--text-faint)" }}
            >
              {t("Бу маълумот ҳеч қаерга юборилмайди — фақат чоп этиладиган варақада кўринади.")}
            </p>
          </div>

          <div
            className="mt-5 flex flex-wrap gap-5 text-[13px] font-semibold"
            style={{ color: "var(--text-faint)" }}
          >
            <span>
              {d.questions.length} {t("кўрсаткич")}
            </span>
            <span>
              {t("Максимал балл")}: {maxScore}
            </span>
            <ViewCount slug={d.slug} fallback={d.views} register />
          </div>

          <button
            className="btn btn-primary focus-ring mt-6 w-full"
            onClick={() => setStarted(true)}
          >
            <Icon name="play" className="w-4 h-4" />
            {t("Тўлдиришни бошлаш")}
          </button>
        </div>
      </div>
    );
  }

  /* ——— Натижа ——— */
  if (done) {
    return (
      <div className="container-x py-6 max-w-2xl">
        <div className="no-print">
          <BackLink href="/diagnostika" label="Барча сўровномалар" />
        </div>

        <div className="card p-7 mt-4">
          <div className="flex items-start gap-4">
            <div
              className="flex w-16 h-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-extrabold text-white"
              style={{ background: `var(--${band.tone === "low" ? "good" : band.tone === "mid" ? "warn" : "bad"})` }}
            >
              {score}
            </div>
            <div className="min-w-0">
              <div
                className="text-[11px] font-bold uppercase tracking-wide"
                style={{ color: "var(--text-faint)" }}
              >
                {t("Натижа")} — {score} / {maxScore} {t("балл")}
              </div>
              <h1 className="mt-1 text-xl font-extrabold">{t(band.level)}</h1>
              {label && (
                <p
                  className="mt-1 text-[13.5px] font-semibold"
                  style={{ color: "var(--text-muted)" }}
                >
                  {label}
                </p>
              )}
            </div>
          </div>

          {/* Шкала */}
          <div className="mt-6 space-y-2">
            {d.bands.map((b) => {
              const active = b.level === band.level;
              const tone =
                b.tone === "low" ? "good" : b.tone === "mid" ? "warn" : "bad";
              return (
                <div
                  key={b.level}
                  className="rounded-lg border px-3.5 py-2.5 flex items-center gap-3"
                  style={{
                    borderColor: active ? `var(--${tone})` : "var(--border)",
                    background: active ? "var(--surface-2)" : "transparent",
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: `var(--${tone})` }}
                  />
                  <span
                    className="text-[13.5px] font-semibold flex-1"
                    style={{ color: active ? "var(--text)" : "var(--text-muted)" }}
                  >
                    {t(b.level)}
                  </span>
                  <span
                    className="text-[12.5px] font-bold"
                    style={{ color: "var(--text-faint)" }}
                  >
                    {b.min}–{b.max}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Тавсия */}
          <div
            className="mt-6 rounded-xl px-4 py-4"
            style={{ background: "var(--brand-light)" }}
          >
            <h2 className="flex items-center gap-2 font-bold text-[14.5px]">
              <Icon name="target" className="w-4.5 h-4.5" />
              {t("Тавсия этилган иш йўналиши")}
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed">{t(band.advice)}</p>
          </div>

          <p
            className="mt-5 text-[12.5px] leading-relaxed"
            style={{ color: "var(--text-faint)" }}
          >
            {t(
              "Натижа ташхис эмас. Якуний хулоса камида уч манбадан олинган маълумот асосида, мутахассислар иштирокида чиқарилади.",
            )}
          </p>

          <div className="mt-6 flex flex-wrap gap-2 no-print">
            <button className="btn btn-ghost focus-ring" onClick={reset}>
              <Icon name="restart" className="w-4 h-4" />
              {t("Қайта тўлдириш")}
            </button>
            <button
              className="btn btn-ghost focus-ring"
              onClick={() => window.print()}
            >
              <Icon name="print" className="w-4 h-4" />
              {t("Чоп этиш")}
            </button>
            <Link href="/diagnostika" className="btn btn-ghost focus-ring">
              {t("Бошқа сўровномалар")}
            </Link>
          </div>
        </div>

        {/* Жавоблар варақаси — чоп этиш учун */}
        <div className="card p-6 mt-4">
          <h2 className="font-bold text-[15px]">{t("Жавоблар варақаси")}</h2>
          <ol className="mt-3 space-y-1.5">
            {d.questions.map((q, i) => {
              const v = answers[i];
              const opt = d.scale.find((s) => s.value === v);
              return (
                <li
                  key={i}
                  className="flex gap-3 text-[13.5px] py-1 border-b last:border-0"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span style={{ color: "var(--text-faint)" }}>{i + 1}.</span>
                  <span className="flex-1">{t(q)}</span>
                  <span className="font-semibold shrink-0">
                    {t(opt?.label ?? "—")} ({v})
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    );
  }

  /* ——— Сўровнома ——— */
  return (
    <div className="container-x py-6 max-w-2xl">
      <div className="flex items-center justify-between gap-4">
        <BackLink href="/diagnostika" label="Чиқиш" />
        <span
          className="text-[13px] font-bold"
          style={{ color: "var(--text-faint)" }}
        >
          {answeredCount} / {d.questions.length}
        </span>
      </div>

      <div
        className="mt-3 h-1.5 w-full rounded-full overflow-hidden sticky top-[104px] z-10"
        style={{ background: "var(--surface-2)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${(answeredCount / d.questions.length) * 100}%`,
            background: "var(--brand)",
          }}
        />
      </div>

      <h1 className="mt-5 text-lg font-extrabold leading-snug">{t(d.title)}</h1>
      <p className="mt-1.5 text-[13.5px]" style={{ color: "var(--text-muted)" }}>
        {t(d.instruction)}
      </p>

      <div className="mt-5 space-y-3">
        {d.questions.map((q, i) => (
          <div key={i} className="card p-4">
            <p className="text-[14.5px] font-medium leading-snug flex gap-2.5">
              <span
                className="font-bold shrink-0"
                style={{ color: "var(--text-faint)" }}
              >
                {i + 1}.
              </span>
              <span>{t(q)}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {d.scale.map((s) => {
                const active = answers[i] === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => setAnswers((a) => ({ ...a, [i]: s.value }))}
                    className="rounded-lg border px-3 py-1.5 text-[13px] font-semibold transition-colors focus-ring"
                    style={
                      active
                        ? {
                            background: "var(--brand)",
                            color: "var(--on-brand)",
                            borderColor: "var(--brand)",
                          }
                        : {
                            background: "var(--surface)",
                            color: "var(--text-muted)",
                            borderColor: "var(--border)",
                          }
                    }
                  >
                    {t(s.label)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div
        className="sticky bottom-0 mt-5 py-3"
        style={{
          background:
            "linear-gradient(to top, var(--bg) 60%, transparent)",
        }}
      >
        <button
          className="btn btn-primary focus-ring w-full"
          onClick={() => setDone(true)}
          disabled={!allAnswered}
        >
          {allAnswered
            ? t("Натижани кўриш")
            : `${t("Яна")} ${d.questions.length - answeredCount} ${t("та кўрсаткич қолди")}`}
          {allAnswered && <Icon name="arrow" className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
