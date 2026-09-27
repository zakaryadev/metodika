"use client";

import { useState } from "react";
import type {
  FillBlankData,
  FindErrorData,
  FlashcardsData,
  QuizData,
  TrueFalseData,
} from "@/content/games";
import { useScript } from "@/lib/script-context";
import { toLatin } from "@/lib/translit";
import { Icon } from "../Icons";
import { Feedback, GameResult, ScoreBar, shuffle } from "./shared";

/* ═══════════════ Тест синови ═══════════════ */

export function QuizGame({ data }: { data: QuizData }) {
  const { t } = useScript();
  const [order, setOrder] = useState<number[]>(() =>
    shuffle(data.questions.map((_, idx) => idx)),
  );
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  const start = () => {
    setOrder(shuffle(data.questions.map((_, idx) => idx)));
    setI(0);
    setPicked(null);
    setCorrect(0);
    setDone(false);
  };

  if (done)
    return (
      <GameResult correct={correct} total={order.length} onRestart={start} />
    );

  const q = data.questions[order[i]];
  const answered = picked !== null;

  const next = () => {
    if (i + 1 >= order.length) setDone(true);
    else {
      setI(i + 1);
      setPicked(null);
    }
  };

  return (
    <div>
      <ScoreBar current={i + 1} total={order.length} correct={correct} />
      <div className="card p-6">
        <h2 className="text-[17px] font-bold leading-snug">{t(q.q)}</h2>
        <div className="mt-5 space-y-2.5">
          {q.options.map((opt, oi) => {
            let bg = "var(--surface)";
            let bd = "var(--border)";
            if (answered) {
              if (oi === q.answer) {
                bg = "color-mix(in srgb, var(--good) 14%, transparent)";
                bd = "var(--good)";
              } else if (oi === picked) {
                bg = "color-mix(in srgb, var(--bad) 14%, transparent)";
                bd = "var(--bad)";
              }
            }
            return (
              <button
                key={oi}
                disabled={answered}
                onClick={() => {
                  setPicked(oi);
                  if (oi === q.answer) setCorrect((c) => c + 1);
                }}
                className="w-full text-left rounded-xl border px-4 py-3.5 transition-all focus-ring flex items-center gap-3 disabled:cursor-default"
                style={{ background: bg, borderColor: bd }}
              >
                <span
                  className="flex w-7 h-7 shrink-0 items-center justify-center rounded-full border text-[12px] font-bold"
                  style={{ borderColor: bd, color: "var(--text-muted)" }}
                >
                  {String.fromCharCode(65 + oi)}
                </span>
                <span className="text-[14.5px] leading-snug">{t(opt)}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <>
            <Feedback ok={picked === q.answer} text={q.explain} />
            <button className="btn btn-primary focus-ring mt-4 w-full" onClick={next}>
              {i + 1 >= order.length ? t("Якунлаш") : t("Кейинги")}
              <Icon name="arrow" className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════ Тўғри / нотўғри ═══════════════ */

export function TrueFalseGame({ data }: { data: TrueFalseData }) {
  const { t } = useScript();
  const [order, setOrder] = useState<number[]>(() =>
    shuffle(data.items.map((_, idx) => idx)),
  );
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<boolean | null>(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  const start = () => {
    setOrder(shuffle(data.items.map((_, idx) => idx)));
    setI(0);
    setPicked(null);
    setCorrect(0);
    setDone(false);
  };

  if (done)
    return <GameResult correct={correct} total={order.length} onRestart={start} />;

  const item = data.items[order[i]];
  const answered = picked !== null;
  const ok = picked === item.isTrue;

  return (
    <div>
      <ScoreBar current={i + 1} total={order.length} correct={correct} />
      <div className="card p-6">
        <p className="text-[17px] md:text-[19px] font-semibold leading-relaxed text-center py-4">
          {t(item.statement)}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {[true, false].map((val) => {
            const isPicked = picked === val;
            let bg = "var(--surface)";
            let bd = "var(--border)";
            let fg = "var(--text)";
            if (answered) {
              if (val === item.isTrue) {
                bg = "var(--good)";
                bd = "var(--good)";
                fg = "#fff";
              } else if (isPicked) {
                bg = "var(--bad)";
                bd = "var(--bad)";
                fg = "#fff";
              }
            }
            return (
              <button
                key={String(val)}
                disabled={answered}
                onClick={() => {
                  setPicked(val);
                  if (val === item.isTrue) setCorrect((c) => c + 1);
                }}
                className="rounded-xl border py-4 font-bold text-[15px] transition-all focus-ring disabled:cursor-default"
                style={{ background: bg, borderColor: bd, color: fg }}
              >
                {t(val ? "Тўғри" : "Нотўғри")}
              </button>
            );
          })}
        </div>

        {answered && (
          <>
            <Feedback ok={ok} text={item.explain} />
            <button
              className="btn btn-primary focus-ring mt-4 w-full"
              onClick={() => {
                if (i + 1 >= order.length) setDone(true);
                else {
                  setI(i + 1);
                  setPicked(null);
                }
              }}
            >
              {i + 1 >= order.length ? t("Якунлаш") : t("Кейинги")}
              <Icon name="arrow" className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════ Бўш жойни тўлдириш ═══════════════ */

/** Жавобни ёзувдан қатъи назар солиштиради */
function answerMatches(given: string, expected: string): boolean {
  const norm = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/[ʻʼ'`ʼʻ’]/g, "")
      .replace(/\s+/g, " ");
  const g = norm(given);
  return g === norm(expected) || g === norm(toLatin(expected));
}

export function FillBlankGame({ data }: { data: FillBlankData }) {
  const { t } = useScript();
  const [order, setOrder] = useState<number[]>(() =>
    shuffle(data.items.map((_, idx) => idx)),
  );
  const [i, setI] = useState(0);
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const start = () => {
    setOrder(shuffle(data.items.map((_, idx) => idx)));
    setI(0);
    setValue("");
    setChecked(false);
    setCorrect(0);
    setDone(false);
    setShowHint(false);
  };

  if (done)
    return <GameResult correct={correct} total={order.length} onRestart={start} />;

  const item = data.items[order[i]];
  const ok = answerMatches(value, item.answer);
  const parts = t(item.sentence).split("___");

  return (
    <div>
      <ScoreBar current={i + 1} total={order.length} correct={correct} />
      <div className="card p-6">
        <p className="text-[16px] md:text-[17.5px] leading-loose">
          {parts[0]}
          <span
            className="inline-block min-w-28 border-b-2 mx-1 text-center font-bold"
            style={{
              borderColor: checked
                ? ok
                  ? "var(--good)"
                  : "var(--bad)"
                : "var(--brand)",
              color: checked ? (ok ? "var(--good)" : "var(--bad)") : "var(--brand)",
            }}
          >
            {value || "    "}
          </span>
          {parts[1] ?? ""}
        </p>

        <input
          className="input mt-5"
          value={value}
          disabled={checked}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim() && !checked) {
              setChecked(true);
              if (answerMatches(value, item.answer)) setCorrect((c) => c + 1);
            }
          }}
          placeholder={t("Жавобни ёзинг…")}
          autoComplete="off"
        />

        {item.hint && !checked && (
          <div className="mt-3">
            {showHint ? (
              <p
                className="text-[13.5px] animate-pop"
                style={{ color: "var(--text-muted)" }}
              >
                <Icon name="lightbulb" className="w-4 h-4 inline mr-1.5" />
                {t(item.hint)}
              </p>
            ) : (
              <button
                className="text-[13px] font-semibold hover:underline focus-ring rounded"
                style={{ color: "var(--brand)" }}
                onClick={() => setShowHint(true)}
              >
                {t("Ёрдам кўрсатмасини очиш")}
              </button>
            )}
          </div>
        )}

        {checked ? (
          <>
            <Feedback
              ok={ok}
              text={ok ? undefined : `${t("Тўғри жавоб")}: ${t(item.answer)}`}
            />
            <button
              className="btn btn-primary focus-ring mt-4 w-full"
              onClick={() => {
                if (i + 1 >= order.length) setDone(true);
                else {
                  setI(i + 1);
                  setValue("");
                  setChecked(false);
                  setShowHint(false);
                }
              }}
            >
              {i + 1 >= order.length ? t("Якунлаш") : t("Кейинги")}
              <Icon name="arrow" className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            className="btn btn-primary focus-ring mt-4 w-full"
            disabled={!value.trim()}
            onClick={() => {
              setChecked(true);
              if (ok) setCorrect((c) => c + 1);
            }}
          >
            <Icon name="check" className="w-4 h-4" />
            {t("Текшириш")}
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════ Хатони топ ═══════════════ */

export function FindErrorGame({ data }: { data: FindErrorData }) {
  const { t } = useScript();
  const [order, setOrder] = useState<number[]>(() =>
    shuffle(data.items.map((_, idx) => idx)),
  );
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  const start = () => {
    setOrder(shuffle(data.items.map((_, idx) => idx)));
    setI(0);
    setPicked(null);
    setCorrect(0);
    setDone(false);
  };

  if (done)
    return <GameResult correct={correct} total={order.length} onRestart={start} />;

  const item = data.items[order[i]];
  const answered = picked !== null;

  return (
    <div>
      <ScoreBar current={i + 1} total={order.length} correct={correct} />
      <div className="card p-6">
        <p
          className="text-[12.5px] font-bold uppercase tracking-wide mb-4"
          style={{ color: "var(--text-faint)" }}
        >
          {t("Хато бўлган қисмни босинг")}
        </p>
        <div className="flex flex-wrap gap-2">
          {item.parts.map((part, pi) => {
            const isErr = pi === item.errorIndex;
            let bg = "var(--surface-2)";
            let bd = "var(--border)";
            let fg = "var(--text)";
            if (answered) {
              if (isErr) {
                bg = "var(--good)";
                bd = "var(--good)";
                fg = "#fff";
              } else if (pi === picked) {
                bg = "var(--bad)";
                bd = "var(--bad)";
                fg = "#fff";
              }
            }
            return (
              <button
                key={pi}
                disabled={answered}
                onClick={() => {
                  setPicked(pi);
                  if (isErr) setCorrect((c) => c + 1);
                }}
                className="rounded-lg border px-3 py-2.5 text-[14.5px] leading-snug text-left transition-all focus-ring disabled:cursor-default"
                style={{ background: bg, borderColor: bd, color: fg }}
              >
                {t(part)}
              </button>
            );
          })}
        </div>

        {answered && (
          <>
            <Feedback ok={picked === item.errorIndex} text={item.explain} />
            <button
              className="btn btn-primary focus-ring mt-4 w-full"
              onClick={() => {
                if (i + 1 >= order.length) setDone(true);
                else {
                  setI(i + 1);
                  setPicked(null);
                }
              }}
            >
              {i + 1 >= order.length ? t("Якунлаш") : t("Кейинги")}
              <Icon name="arrow" className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════ Флеш-карталар ═══════════════ */

export function FlashcardsGame({ data }: { data: FlashcardsData }) {
  const { t } = useScript();
  const [order, setOrder] = useState<number[]>(() =>
    shuffle(data.cards.map((_, idx) => idx)),
  );
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [done, setDone] = useState(false);

  const start = () => {
    setOrder(shuffle(data.cards.map((_, idx) => idx)));
    setI(0);
    setFlipped(false);
    setKnown(0);
    setDone(false);
  };

  if (done)
    return (
      <GameResult
        correct={known}
        total={order.length}
        onRestart={start}
        unit="картани билдингиз"
      />
    );

  const card = data.cards[order[i]];

  const mark = (isKnown: boolean) => {
    if (isKnown) setKnown((k) => k + 1);
    if (i + 1 >= order.length) setDone(true);
    else {
      setI(i + 1);
      setFlipped(false);
    }
  };

  return (
    <div>
      <ScoreBar current={i + 1} total={order.length} correct={known} />

      <button
        onClick={() => setFlipped((f) => !f)}
        className="card w-full p-8 md:p-12 text-center focus-ring transition-colors"
        style={{
          minHeight: 240,
          background: flipped ? "var(--brand-light)" : "var(--surface)",
        }}
      >
        <div
          className="text-[11px] font-bold uppercase tracking-wide mb-4"
          style={{ color: "var(--text-faint)" }}
        >
          {t(flipped ? "Жавоб" : "Савол")}
        </div>
        <p className="text-[17px] md:text-[20px] font-semibold leading-relaxed animate-pop">
          {t(flipped ? card.back : card.front)}
        </p>
        {!flipped && (
          <p className="mt-6 text-[12.5px]" style={{ color: "var(--text-faint)" }}>
            {t("Жавобни кўриш учун картани босинг")}
          </p>
        )}
      </button>

      {flipped && (
        <div className="mt-4 grid grid-cols-2 gap-3 animate-pop">
          <button
            className="btn btn-ghost focus-ring"
            onClick={() => mark(false)}
            style={{ borderColor: "var(--bad)", color: "var(--bad)" }}
          >
            <Icon name="restart" className="w-4 h-4" />
            {t("Такрорлаш керак")}
          </button>
          <button
            className="btn btn-primary focus-ring"
            onClick={() => mark(true)}
            style={{ background: "var(--good)" }}
          >
            <Icon name="check" className="w-4 h-4" />
            {t("Билдим")}
          </button>
        </div>
      )}
    </div>
  );
}
