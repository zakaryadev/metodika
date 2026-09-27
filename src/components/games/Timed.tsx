"use client";

import { useEffect, useRef, useState } from "react";
import type { ScenarioData, SpeedData, WheelData } from "@/content/games";
import { useScript } from "@/lib/script-context";
import { Icon } from "../Icons";
import { GameResult, shuffle } from "./shared";

/* ═══════════════ Тезлик пойгаси ═══════════════ */

export function SpeedGame({ data }: { data: SpeedData }) {
  const { t } = useScript();
  const [phase, setPhase] = useState<"idle" | "run" | "over">("idle");
  const [left, setLeft] = useState(data.seconds);
  const [order, setOrder] = useState<number[]>([]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [flash, setFlash] = useState<"ok" | "bad" | null>(null);

  const start = () => {
    setOrder(shuffle(data.questions.map((_, idx) => idx)));
    setI(0);
    setScore(0);
    setAnswered(0);
    setLeft(data.seconds);
    setPhase("run");
  };

  useEffect(() => {
    if (phase !== "run") return;
    const id = setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          clearInterval(id);
          setPhase("over");
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  if (phase === "idle")
    return (
      <div className="card p-8 text-center">
        <span
          className="mx-auto flex w-16 h-16 items-center justify-center rounded-2xl text-white"
          style={{ background: "var(--grad-rose)" }}
        >
          <Icon name="clock" className="w-8 h-8" />
        </span>
        <h2 className="mt-4 text-xl font-extrabold">
          {data.seconds} {t("сония")}
        </h2>
        <p className="mt-2 text-[14.5px]" style={{ color: "var(--text-muted)" }}>
          {t("Вақт тугагунча имкон қадар кўп саволга тўғри жавоб беринг")}
        </p>
        <button className="btn btn-primary focus-ring mt-6" onClick={start}>
          <Icon name="play" className="w-4 h-4" />
          {t("Бошлаш")}
        </button>
      </div>
    );

  if (phase === "over")
    return (
      <GameResult
        correct={score}
        total={Math.max(answered, 1)}
        onRestart={start}
        unit="тўғри жавоб"
        customScore={`${score}`}
      />
    );

  const q = data.questions[order[i % order.length]];
  const pct = (left / data.seconds) * 100;

  const answer = (oi: number) => {
    const ok = oi === q.answer;
    if (ok) setScore((s) => s + 1);
    setAnswered((a) => a + 1);
    setFlash(ok ? "ok" : "bad");
    setTimeout(() => setFlash(null), 180);
    setI((v) => v + 1);
  };

  return (
    <div>
      {/* Таймер */}
      <div className="flex items-center gap-3 mb-4">
        <span
          className="text-2xl font-extrabold tabular-nums"
          style={{ color: left <= 10 ? "var(--bad)" : "var(--text)" }}
        >
          {left}
        </span>
        <div
          className="flex-1 h-2 rounded-full overflow-hidden"
          style={{ background: "var(--surface-2)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${pct}%`,
              background: left <= 10 ? "var(--bad)" : "var(--brand)",
            }}
          />
        </div>
        <span
          className="text-[13px] font-bold"
          style={{ color: "var(--good)" }}
        >
          {score}
        </span>
      </div>

      <div
        className="card p-6 transition-colors"
        style={{
          background:
            flash === "ok"
              ? "color-mix(in srgb, var(--good) 12%, var(--surface))"
              : flash === "bad"
                ? "color-mix(in srgb, var(--bad) 12%, var(--surface))"
                : "var(--surface)",
        }}
      >
        <h2 className="text-[17px] font-bold leading-snug text-center py-3">
          {t(q.q)}
        </h2>
        <div className="mt-3 grid gap-2.5">
          {q.options.map((opt, oi) => (
            <button
              key={oi}
              onClick={() => answer(oi)}
              className="rounded-xl border px-4 py-3.5 text-[14.5px] font-semibold transition-colors focus-ring"
              style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
            >
              {t(opt)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ Омад чархи ═══════════════ */

const WHEEL_COLORS = [
  "var(--blue)",
  "var(--violet)",
  "var(--emerald)",
  "var(--orange)",
  "var(--rose)",
  "var(--cyan)",
  "var(--amber)",
  "var(--indigo)",
];

export function WheelGame({ data }: { data: WheelData }) {
  const { t } = useScript();
  const n = data.items.length;
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [used, setUsed] = useState<number[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setSelected(null);
    setShowAnswer(false);

    const remaining = data.items.map((_, i) => i).filter((i) => !used.includes(i));
    const pool = remaining.length ? remaining : data.items.map((_, i) => i);
    if (!remaining.length) setUsed([]);
    const target = pool[Math.floor(Math.random() * pool.length)];

    const seg = 360 / n;
    // Кўрсаткич тепада — сектор маркази тепага келиши керак
    const targetAngle = 360 * 5 + (360 - (target * seg + seg / 2));
    setAngle((a) => a + (targetAngle - (a % 360)));

    timer.current = setTimeout(() => {
      setSpinning(false);
      setSelected(target);
      setUsed((u) => [...u, target]);
    }, 3200);
  };

  const seg = 360 / n;
  const item = selected !== null ? data.items[selected] : null;

  return (
    <div className="grid gap-5 lg:grid-cols-[300px_1fr] items-start">
      <div className="mx-auto">
        <div className="relative w-[280px] h-[280px]">
          {/* Кўрсаткич */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-1 z-10"
            style={{
              width: 0,
              height: 0,
              borderLeft: "11px solid transparent",
              borderRight: "11px solid transparent",
              borderTop: "20px solid var(--text)",
            }}
          />
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            style={{
              transform: `rotate(${angle}deg)`,
              transition: spinning
                ? "transform 3.1s cubic-bezier(0.17, 0.67, 0.21, 1)"
                : "none",
            }}
          >
            {data.items.map((_, idx) => {
              const a0 = (idx * seg - 90) * (Math.PI / 180);
              const a1 = ((idx + 1) * seg - 90) * (Math.PI / 180);
              const x0 = 100 + 96 * Math.cos(a0);
              const y0 = 100 + 96 * Math.sin(a0);
              const x1 = 100 + 96 * Math.cos(a1);
              const y1 = 100 + 96 * Math.sin(a1);
              const large = seg > 180 ? 1 : 0;
              const mid = (idx * seg + seg / 2 - 90) * (Math.PI / 180);
              return (
                <g key={idx}>
                  <path
                    d={`M100 100 L${x0} ${y0} A96 96 0 ${large} 1 ${x1} ${y1} Z`}
                    fill={WHEEL_COLORS[idx % WHEEL_COLORS.length]}
                    stroke="var(--surface)"
                    strokeWidth="1.5"
                  />
                  <text
                    x={100 + 66 * Math.cos(mid)}
                    y={100 + 66 * Math.sin(mid)}
                    fill="#fff"
                    fontSize="15"
                    fontWeight="800"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {idx + 1}
                  </text>
                </g>
              );
            })}
            <circle cx="100" cy="100" r="17" fill="var(--surface)" />
          </svg>
        </div>

        <button
          className="btn btn-primary focus-ring mt-4 w-full"
          onClick={spin}
          disabled={spinning}
        >
          <Icon name="restart" className="w-4 h-4" />
          {t(spinning ? "Айланмоқда…" : "Айлантириш")}
        </button>
        <p
          className="mt-2 text-center text-[12px]"
          style={{ color: "var(--text-faint)" }}
        >
          {used.length} / {n} {t("савол берилди")}
        </p>
      </div>

      <div className="card p-6 min-h-52 flex flex-col justify-center">
        {!item ? (
          <p
            className="text-center text-[14.5px]"
            style={{ color: "var(--text-muted)" }}
          >
            {t("Чархни айлантиринг — савол шу ерда кўринади")}
          </p>
        ) : (
          <div className="animate-pop">
            <div
              className="text-[11px] font-bold uppercase tracking-wide"
              style={{ color: "var(--text-faint)" }}
            >
              {t("Савол")} {selected! + 1}
            </div>
            <h2 className="mt-2 text-[18px] font-bold leading-snug">
              {t(item.q)}
            </h2>

            {showAnswer ? (
              <div
                className="mt-4 rounded-xl px-4 py-3.5 animate-pop"
                style={{ background: "var(--brand-light)" }}
              >
                <div
                  className="text-[11px] font-bold uppercase tracking-wide mb-1"
                  style={{ color: "var(--text-faint)" }}
                >
                  {t("Жавоб")}
                </div>
                <p className="text-[14.5px] leading-relaxed">{t(item.a)}</p>
              </div>
            ) : (
              <button
                className="btn btn-soft focus-ring mt-4"
                onClick={() => setShowAnswer(true)}
              >
                <Icon name="eye" className="w-4 h-4" />
                {t("Жавобни кўрсатиш")}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════ Вазият таҳлили ═══════════════ */

export function ScenarioGame({ data }: { data: ScenarioData }) {
  const { t } = useScript();
  const [id, setId] = useState(data.start);
  const [path, setPath] = useState<string[]>([]);

  const node = data.nodes[id];
  if (!node) return null;

  const restart = () => {
    setId(data.start);
    setPath([]);
  };

  const toneColor =
    node.outcome === "good"
      ? "var(--good)"
      : node.outcome === "bad"
        ? "var(--bad)"
        : "var(--warn)";

  return (
    <div>
      {/* Йўл индикатори */}
      {path.length > 0 && (
        <div className="flex items-center gap-1.5 mb-4">
          {path.map((_, i) => (
            <span
              key={i}
              className="h-1.5 flex-1 rounded-full"
              style={{ background: "var(--brand)" }}
            />
          ))}
          <span
            className="h-1.5 flex-1 rounded-full"
            style={{ background: node.outcome ? toneColor : "var(--border-strong)" }}
          />
        </div>
      )}

      <div className="card p-6">
        {node.outcome && (
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold text-white mb-3"
            style={{ background: toneColor }}
          >
            <Icon
              name={node.outcome === "good" ? "check" : node.outcome === "bad" ? "close" : "clock"}
              className="w-3.5 h-3.5"
            />
            {t(
              node.outcome === "good"
                ? "Самарали ечим"
                : node.outcome === "bad"
                  ? "Нотўғри йўл"
                  : "Қисман тўғри",
            )}
          </div>
        )}

        <p className="text-[15.5px] md:text-[17px] leading-relaxed">
          {t(node.text)}
        </p>

        {node.feedback && (
          <div
            className="mt-5 rounded-xl px-4 py-3.5 flex gap-3"
            style={{ background: "var(--surface-2)" }}
          >
            <Icon name="lightbulb" className="w-5 h-5 shrink-0 mt-0.5" />
            <p
              className="text-[14px] leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {t(node.feedback)}
            </p>
          </div>
        )}

        {node.options && node.options.length > 0 ? (
          <div className="mt-5 space-y-2.5">
            <p
              className="text-[12.5px] font-bold uppercase tracking-wide"
              style={{ color: "var(--text-faint)" }}
            >
              {t("Қарорингиз")}
            </p>
            {node.options.map((o) => (
              <button
                key={o.next}
                onClick={() => {
                  setPath((p) => [...p, id]);
                  setId(o.next);
                }}
                className="w-full text-left rounded-xl border px-4 py-3.5 text-[14.5px] leading-snug transition-all focus-ring hover:border-[color:var(--brand)]"
                style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
              >
                {t(o.label)}
              </button>
            ))}
          </div>
        ) : (
          <button className="btn btn-primary focus-ring mt-5 w-full" onClick={restart}>
            <Icon name="restart" className="w-4 h-4" />
            {t("Бошқа йўлни синаб кўриш")}
          </button>
        )}
      </div>
    </div>
  );
}
