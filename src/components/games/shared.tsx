"use client";

import { useScript } from "@/lib/script-context";
import { Icon } from "../Icons";

/** Fisher–Yates аралаштириш */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Progress({ value, max }: { value: number; max: number }) {
  return (
    <div
      className="h-1.5 w-full rounded-full overflow-hidden"
      style={{ background: "var(--surface-2)" }}
    >
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${max ? (value / max) * 100 : 0}%`,
          background: "var(--brand)",
        }}
      />
    </div>
  );
}

export function ScoreBar({
  current,
  total,
  correct,
  extra,
}: {
  current: number;
  total: number;
  correct?: number;
  extra?: React.ReactNode;
}) {
  const { t } = useScript();
  return (
    <div className="mb-4">
      <div
        className="flex items-center justify-between gap-3 mb-2 text-[13px] font-bold"
        style={{ color: "var(--text-faint)" }}
      >
        <span>
          {current} / {total}
        </span>
        <div className="flex items-center gap-3">
          {extra}
          {correct !== undefined && (
            <span style={{ color: "var(--good)" }}>
              <Icon name="check" className="w-3.5 h-3.5 inline mr-1" />
              {correct} {t("тўғри")}
            </span>
          )}
        </div>
      </div>
      <Progress value={current} max={total} />
    </div>
  );
}

/** Ўйин якунланганда кўрсатиладиган натижа картаси */
export function GameResult({
  correct,
  total,
  onRestart,
  unit = "тўғри жавоб",
  customScore,
}: {
  correct: number;
  total: number;
  onRestart: () => void;
  unit?: string;
  customScore?: string;
}) {
  const { t } = useScript();
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const tone = pct >= 80 ? "good" : pct >= 50 ? "warn" : "bad";
  const label =
    pct >= 80 ? "Аъло!" : pct >= 50 ? "Яхши, давом этинг" : "Яна бир марта уриниб кўринг";

  return (
    <div className="card p-8 text-center animate-pop">
      <div
        className="mx-auto flex w-24 h-24 items-center justify-center rounded-full text-2xl font-extrabold text-white"
        style={{ background: `var(--${tone})` }}
      >
        {customScore ?? `${pct}%`}
      </div>
      <h2 className="mt-4 text-xl font-extrabold">{t(label)}</h2>
      <p className="mt-1.5 text-[15px]" style={{ color: "var(--text-muted)" }}>
        <b style={{ color: "var(--text)" }}>{correct}</b> / {total} {t(unit)}
      </p>
      <button className="btn btn-primary focus-ring mt-6" onClick={onRestart}>
        <Icon name="restart" className="w-4 h-4" />
        {t("Қайтадан ўйнаш")}
      </button>
    </div>
  );
}

/** Тўғри/нотўғри жавоб изоҳи */
export function Feedback({
  ok,
  text,
}: {
  ok: boolean;
  text?: string;
}) {
  const { t } = useScript();
  return (
    <div
      className="mt-4 rounded-xl px-4 py-3.5 flex gap-3 animate-pop"
      style={{
        background: ok
          ? "color-mix(in srgb, var(--good) 12%, transparent)"
          : "color-mix(in srgb, var(--bad) 12%, transparent)",
      }}
    >
      <span
        className="flex w-6 h-6 shrink-0 items-center justify-center rounded-full text-white"
        style={{ background: ok ? "var(--good)" : "var(--bad)" }}
      >
        <Icon name={ok ? "check" : "close"} className="w-3.5 h-3.5" />
      </span>
      <div className="min-w-0">
        <p
          className="font-bold text-[14px]"
          style={{ color: ok ? "var(--good)" : "var(--bad)" }}
        >
          {t(ok ? "Тўғри!" : "Нотўғри")}
        </p>
        {text && (
          <p
            className="mt-1 text-[13.5px] leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {t(text)}
          </p>
        )}
      </div>
    </div>
  );
}

/** Латин ёзувида ҳам ишлайдиган ҳарф рўйхати */
export function alphabetFor(script: "cyr" | "lat"): string[] {
  return script === "lat"
    ? "ABCDEFGHIJKLMNOPQRSTUVXYZ".split("")
    : "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЪЬЭЮЯЎҚҒҲ".split("");
}
