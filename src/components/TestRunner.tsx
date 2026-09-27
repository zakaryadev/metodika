"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getTest } from "@/content/tests";
import { useScript } from "@/lib/script-context";
import { Icon } from "./Icons";
import { ViewCount } from "./ViewCount";
import { BackLink, CategoryChip } from "./ui";

export function TestRunner({ slug }: { slug: string }) {
  const { t } = useScript();
  const test = getTest(slug);

  const [started, setStarted] = useState(false);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const total = test?.questions.length ?? 0;
  const correct = useMemo(
    () =>
      test
        ? answers.filter((a, idx) => a === test.questions[idx]?.answer).length
        : 0,
    [answers, test],
  );

  if (!test) return null;
  const q = test.questions[i];

  const reset = () => {
    setStarted(false);
    setI(0);
    setPicked(null);
    setAnswers([]);
    setDone(false);
  };

  const next = () => {
    if (picked === null) return;
    const updated = [...answers, picked];
    setAnswers(updated);
    setPicked(null);
    if (i + 1 >= total) setDone(true);
    else setI(i + 1);
  };

  /* ——— Бошланғич экран ——— */
  if (!started) {
    return (
      <div className="container-x py-6 max-w-2xl">
        <BackLink href="/testlar" label="Барча тестлар" />
        <div className="card p-7 mt-4 text-center">
          <span
            className="mx-auto flex w-14 h-14 items-center justify-center rounded-2xl text-white"
            style={{ background: "var(--grad-cyan)" }}
          >
            <Icon name="test" className="w-7 h-7" />
          </span>
          <div className="mt-4 flex justify-center">
            <CategoryChip id={test.category} />
          </div>
          <h1 className="mt-3 text-xl md:text-2xl font-extrabold leading-tight">
            {t(test.title)}
          </h1>
          <p
            className="mt-2.5 text-[14.5px] leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {t(test.description)}
          </p>
          <div
            className="mt-5 flex justify-center gap-6 text-[13px] font-semibold"
            style={{ color: "var(--text-faint)" }}
          >
            <span>
              {total} {t("савол")}
            </span>
            <span>{t("Ҳар бир савол изоҳ билан")}</span>
            <ViewCount slug={test.slug} fallback={test.views} register />
          </div>
          <button
            className="btn btn-primary focus-ring mt-6 w-full sm:w-auto sm:px-10"
            onClick={() => setStarted(true)}
          >
            <Icon name="play" className="w-4 h-4" />
            {t("Тестни бошлаш")}
          </button>
        </div>
      </div>
    );
  }

  /* ——— Натижа ——— */
  if (done) {
    const pct = Math.round((correct / total) * 100);
    const tone = pct >= 80 ? "good" : pct >= 50 ? "warn" : "bad";
    const label =
      pct >= 80 ? "Аъло натижа" : pct >= 50 ? "Яхши, лекин такрорлаш керак" : "Мавзуни қайта ўрганинг";

    return (
      <div className="container-x py-6 max-w-2xl">
        <BackLink href="/testlar" label="Барча тестлар" />

        <div className="card p-7 mt-4 text-center">
          <div
            className="mx-auto flex w-24 h-24 items-center justify-center rounded-full text-3xl font-extrabold text-white"
            style={{ background: `var(--${tone})` }}
          >
            {pct}%
          </div>
          <h1 className="mt-4 text-xl font-extrabold">{t(label)}</h1>
          <p className="mt-1.5 text-[15px]" style={{ color: "var(--text-muted)" }}>
            {total} {t("саволдан")} <b style={{ color: "var(--text)" }}>{correct}</b>{" "}
            {t("тасига тўғри жавоб бердингиз")}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button className="btn btn-primary focus-ring" onClick={reset}>
              <Icon name="restart" className="w-4 h-4" />
              {t("Қайта топшириш")}
            </button>
            <Link href="/testlar" className="btn btn-ghost focus-ring">
              {t("Бошқа тестлар")}
            </Link>
          </div>
        </div>

        {/* Таҳлил */}
        <h2 className="mt-8 mb-3 text-lg font-extrabold">{t("Жавоблар таҳлили")}</h2>
        <div className="space-y-3">
          {test.questions.map((qq, idx) => {
            const given = answers[idx];
            const ok = given === qq.answer;
            return (
              <div key={idx} className="card p-5">
                <div className="flex gap-3">
                  <span
                    className="flex w-6 h-6 shrink-0 items-center justify-center rounded-full text-white"
                    style={{ background: ok ? "var(--good)" : "var(--bad)" }}
                  >
                    <Icon name={ok ? "check" : "close"} className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-[14.5px] leading-snug">
                      {idx + 1}. {t(qq.q)}
                    </p>
                    {!ok && (
                      <p
                        className="mt-1.5 text-[13.5px]"
                        style={{ color: "var(--bad)" }}
                      >
                        {t("Сизнинг жавобингиз")}: {t(qq.options[given] ?? "—")}
                      </p>
                    )}
                    <p
                      className="mt-1 text-[13.5px] font-semibold"
                      style={{ color: "var(--good)" }}
                    >
                      {t("Тўғри жавоб")}: {t(qq.options[qq.answer])}
                    </p>
                    {qq.explain && (
                      <p
                        className="mt-2 text-[13.5px] leading-relaxed"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {t(qq.explain)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ——— Савол ——— */
  return (
    <div className="container-x py-6 max-w-2xl">
      <div className="flex items-center justify-between gap-4">
        <BackLink href="/testlar" label="Чиқиш" />
        <span
          className="text-[13px] font-bold"
          style={{ color: "var(--text-faint)" }}
        >
          {i + 1} / {total}
        </span>
      </div>

      {/* Прогресс */}
      <div
        className="mt-3 h-1.5 w-full rounded-full overflow-hidden"
        style={{ background: "var(--surface-2)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${(i / total) * 100}%`, background: "var(--brand)" }}
        />
      </div>

      <div className="card p-6 mt-5">
        <h1 className="text-[17px] md:text-[19px] font-bold leading-snug">
          {t(q.q)}
        </h1>

        <div className="mt-5 space-y-2.5">
          {q.options.map((opt, oi) => {
            const isPicked = picked === oi;
            return (
              <button
                key={oi}
                onClick={() => setPicked(oi)}
                className="w-full text-left rounded-xl border px-4 py-3.5 transition-all focus-ring flex items-center gap-3"
                style={{
                  borderColor: isPicked ? "var(--brand)" : "var(--border)",
                  background: isPicked ? "var(--brand-light)" : "var(--surface)",
                }}
              >
                <span
                  className="flex w-7 h-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold border"
                  style={{
                    borderColor: isPicked ? "var(--brand)" : "var(--border-strong)",
                    background: isPicked ? "var(--brand)" : "transparent",
                    color: isPicked ? "var(--on-brand)" : "var(--text-muted)",
                  }}
                >
                  {String.fromCharCode(65 + oi)}
                </span>
                <span className="text-[14.5px] leading-snug">{t(opt)}</span>
              </button>
            );
          })}
        </div>

        <button
          className="btn btn-primary focus-ring mt-6 w-full"
          onClick={next}
          disabled={picked === null}
        >
          {i + 1 >= total ? t("Якунлаш") : t("Кейинги савол")}
          <Icon name="arrow" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
