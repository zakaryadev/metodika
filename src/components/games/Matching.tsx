"use client";

import { useEffect, useState } from "react";
import type {
  AnagramData,
  CategorizeData,
  MatchData,
  MemoryData,
  OrderingData,
} from "@/content/games";
import { useScript } from "@/lib/script-context";
import { Icon } from "../Icons";
import { Feedback, GameResult, ScoreBar, shuffle } from "./shared";

/* ═══════════════ Хотира жуфтлари ═══════════════ */

type Card = { id: number; pair: number; text: string };

export function MemoryGame({ data }: { data: MemoryData }) {
  const { t } = useScript();
  const buildDeck = () => {
    const deck: Card[] = [];
    data.pairs.forEach((p, i) => {
      deck.push({ id: i * 2, pair: i, text: p.a });
      deck.push({ id: i * 2 + 1, pair: i, text: p.b });
    });
    return shuffle(deck);
  };

  const [cards, setCards] = useState<Card[]>(buildDeck);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  // Иккита карта очиқ турганда — бошқа карта босилмайди
  const lock = open.length === 2;

  const start = () => {
    setCards(buildDeck());
    setOpen([]);
    setMatched([]);
    setMoves(0);
  };

  useEffect(() => {
    if (open.length !== 2) return;
    const [a, b] = open;
    const ca = cards.find((c) => c.id === a);
    const cb = cards.find((c) => c.id === b);
    const isMatch = ca && cb && ca.pair === cb.pair;
    const timer = setTimeout(
      () => {
        if (isMatch) setMatched((m) => [...m, ca.pair]);
        setOpen([]);
      },
      isMatch ? 420 : 900,
    );
    return () => clearTimeout(timer);
  }, [open, cards]);

  const allDone = matched.length === data.pairs.length && cards.length > 0;

  if (allDone) {
    return (
      <GameResult
        correct={data.pairs.length}
        total={data.pairs.length}
        onRestart={start}
        unit="жуфт топилди"
        customScore={`${moves}`}
      />
    );
  }

  return (
    <div>
      <ScoreBar
        current={matched.length}
        total={data.pairs.length}
        extra={
          <span>
            {t("Ҳаракат")}: {moves}
          </span>
        }
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {cards.map((c) => {
          const isOpen = open.includes(c.id);
          const isMatched = matched.includes(c.pair);
          const visible = isOpen || isMatched;
          return (
            <button
              key={c.id}
              disabled={lock || visible}
              onClick={() => {
                if (lock || visible || open.length >= 2) return;
                setOpen((o) => [...o, c.id]);
                if (open.length === 1) setMoves((m) => m + 1);
              }}
              className="rounded-xl border p-3 min-h-24 flex items-center justify-center text-center transition-all focus-ring disabled:cursor-default"
              style={{
                background: isMatched
                  ? "color-mix(in srgb, var(--good) 14%, transparent)"
                  : isOpen
                    ? "var(--brand-light)"
                    : "var(--surface-2)",
                borderColor: isMatched
                  ? "var(--good)"
                  : isOpen
                    ? "var(--brand)"
                    : "var(--border)",
              }}
            >
              {visible ? (
                <span className="text-[13px] font-semibold leading-snug animate-pop">
                  {t(c.text)}
                </span>
              ) : (
                <Icon
                  name="layers"
                  className="w-6 h-6"
                  />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════ Мослаштириш ═══════════════ */

export function MatchGame({ data }: { data: MatchData }) {
  const { t } = useScript();
  const indexes = () => data.pairs.map((_, i) => i);

  const [lefts, setLefts] = useState<number[]>(() => shuffle(indexes()));
  const [rights, setRights] = useState<number[]>(() => shuffle(indexes()));
  const [selL, setSelL] = useState<number | null>(null);
  const [linked, setLinked] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);

  const start = () => {
    setLefts(shuffle(indexes()));
    setRights(shuffle(indexes()));
    setSelL(null);
    setLinked([]);
    setWrong(null);
    setErrors(0);
  };

  const done = linked.length === data.pairs.length && lefts.length > 0;

  if (done)
    return (
      <GameResult
        correct={data.pairs.length}
        total={data.pairs.length + errors}
        onRestart={start}
        unit="жуфт тўғри боғланди"
        customScore={`${data.pairs.length}`}
      />
    );

  const pick = (r: number) => {
    if (selL === null) return;
    if (selL === r) {
      setLinked((l) => [...l, r]);
      setSelL(null);
    } else {
      setErrors((e) => e + 1);
      setWrong(r);
      setTimeout(() => setWrong(null), 500);
    }
  };

  return (
    <div>
      <ScoreBar
        current={linked.length}
        total={data.pairs.length}
        extra={
          <span style={{ color: "var(--bad)" }}>
            {t("Хато")}: {errors}
          </span>
        }
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {lefts.map((idx) => {
            const isLinked = linked.includes(idx);
            const isSel = selL === idx;
            return (
              <button
                key={idx}
                disabled={isLinked}
                onClick={() => setSelL(idx)}
                className="w-full rounded-lg border px-3 py-3 text-left text-[13.5px] font-semibold leading-snug transition-all focus-ring disabled:opacity-45 disabled:cursor-default"
                style={{
                  background: isLinked
                    ? "color-mix(in srgb, var(--good) 14%, transparent)"
                    : isSel
                      ? "var(--brand)"
                      : "var(--surface)",
                  color: isSel ? "var(--on-brand)" : "var(--text)",
                  borderColor: isLinked
                    ? "var(--good)"
                    : isSel
                      ? "var(--brand)"
                      : "var(--border)",
                }}
              >
                {t(data.pairs[idx].left)}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {rights.map((idx) => {
            const isLinked = linked.includes(idx);
            const isWrong = wrong === idx;
            return (
              <button
                key={idx}
                disabled={isLinked || selL === null}
                onClick={() => pick(idx)}
                className={`w-full rounded-lg border px-3 py-3 text-left text-[13.5px] leading-snug transition-all focus-ring disabled:cursor-default ${isWrong ? "animate-shake" : ""}`}
                style={{
                  background: isLinked
                    ? "color-mix(in srgb, var(--good) 14%, transparent)"
                    : isWrong
                      ? "color-mix(in srgb, var(--bad) 16%, transparent)"
                      : "var(--surface)",
                  borderColor: isLinked
                    ? "var(--good)"
                    : isWrong
                      ? "var(--bad)"
                      : "var(--border)",
                  opacity: isLinked ? 0.45 : 1,
                }}
              >
                {t(data.pairs[idx].right)}
              </button>
            );
          })}
        </div>
      </div>
      <p
        className="mt-4 text-center text-[12.5px]"
        style={{ color: "var(--text-faint)" }}
      >
        {t("Аввал чап устундан, сўнг ўнг устундан танланг")}
      </p>
    </div>
  );
}

/* ═══════════════ Гуруҳларга ажратиш ═══════════════ */

export function CategorizeGame({ data }: { data: CategorizeData }) {
  const { t } = useScript();
  const [queue, setQueue] = useState<number[]>(() =>
    shuffle(data.items.map((_, idx) => idx)),
  );
  const [i, setI] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const start = () => {
    setQueue(shuffle(data.items.map((_, idx) => idx)));
    setI(0);
    setCorrect(0);
    setPicked(null);
    setDone(false);
  };

  if (done)
    return <GameResult correct={correct} total={queue.length} onRestart={start} />;

  const item = data.items[queue[i]];
  const answered = picked !== null;

  return (
    <div>
      <ScoreBar current={i + 1} total={queue.length} correct={correct} />
      <div className="card p-6">
        <p
          className="text-[12.5px] font-bold uppercase tracking-wide mb-3"
          style={{ color: "var(--text-faint)" }}
        >
          {t("Қайси гуруҳга тегишли?")}
        </p>
        <p className="text-[17px] md:text-[19px] font-semibold leading-relaxed py-4 text-center">
          {t(item.text)}
        </p>

        <div className="mt-2 grid gap-2.5 sm:grid-cols-3">
          {data.groups.map((g) => {
            let bg = "var(--surface-2)";
            let bd = "var(--border)";
            let fg = "var(--text)";
            if (answered) {
              if (g === item.group) {
                bg = "var(--good)";
                bd = "var(--good)";
                fg = "#fff";
              } else if (g === picked) {
                bg = "var(--bad)";
                bd = "var(--bad)";
                fg = "#fff";
              }
            }
            return (
              <button
                key={g}
                disabled={answered}
                onClick={() => {
                  setPicked(g);
                  if (g === item.group) setCorrect((c) => c + 1);
                }}
                className="rounded-xl border px-3 py-3.5 text-[13.5px] font-semibold leading-snug transition-all focus-ring disabled:cursor-default"
                style={{ background: bg, borderColor: bd, color: fg }}
              >
                {t(g)}
              </button>
            );
          })}
        </div>

        {answered && (
          <>
            <Feedback
              ok={picked === item.group}
              text={
                picked === item.group
                  ? undefined
                  : `${t("Тўғри гуруҳ")}: ${t(item.group)}`
              }
            />
            <button
              className="btn btn-primary focus-ring mt-4 w-full"
              onClick={() => {
                if (i + 1 >= queue.length) setDone(true);
                else {
                  setI(i + 1);
                  setPicked(null);
                }
              }}
            >
              {i + 1 >= queue.length ? t("Якунлаш") : t("Кейинги")}
              <Icon name="arrow" className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════ Кетма-кетликни тузиш ═══════════════ */

export function OrderingGame({ data }: { data: OrderingData }) {
  const { t } = useScript();
  const stepsOf = (idx: number) => data.items[idx].steps.map((_, i) => i);

  const [taskI, setTaskI] = useState(0);
  const [pool, setPool] = useState<number[]>(() => shuffle(stepsOf(0)));
  const [placed, setPlaced] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [done, setDone] = useState(false);

  const task = data.items[taskI];

  const loadTask = (idx: number) => {
    setPool(shuffle(stepsOf(idx)));
    setPlaced([]);
    setWrong(null);
  };

  const start = () => {
    setTaskI(0);
    setErrors(0);
    setDone(false);
    loadTask(0);
  };

  if (done)
    return (
      <GameResult
        correct={data.items.length}
        total={data.items.length}
        onRestart={start}
        unit="топшириқ бажарилди"
        customScore={`${errors} ${t("хато")}`}
      />
    );

  const complete = placed.length === task.steps.length;

  const click = (stepIdx: number) => {
    if (stepIdx === placed.length) {
      const nextPlaced = [...placed, stepIdx];
      setPlaced(nextPlaced);
      setPool((p) => p.filter((x) => x !== stepIdx));
    } else {
      setErrors((e) => e + 1);
      setWrong(stepIdx);
      setTimeout(() => setWrong(null), 450);
    }
  };

  return (
    <div>
      <ScoreBar
        current={taskI + 1}
        total={data.items.length}
        extra={
          <span style={{ color: "var(--bad)" }}>
            {t("Хато")}: {errors}
          </span>
        }
      />
      <div className="card p-6">
        <h2 className="text-[16px] font-bold leading-snug">{t(task.prompt)}</h2>

        {/* Жойлаштирилганлар */}
        {placed.length > 0 && (
          <ol className="mt-4 space-y-2">
            {placed.map((s, n) => (
              <li
                key={s}
                className="flex items-center gap-3 rounded-lg border px-3 py-2.5 animate-pop"
                style={{
                  background: "color-mix(in srgb, var(--good) 12%, transparent)",
                  borderColor: "var(--good)",
                }}
              >
                <span
                  className="flex w-6 h-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ background: "var(--good)" }}
                >
                  {n + 1}
                </span>
                <span className="text-[13.5px] font-medium leading-snug">
                  {t(task.steps[s])}
                </span>
              </li>
            ))}
          </ol>
        )}

        {/* Танлов */}
        {!complete && (
          <div className="mt-4">
            <p
              className="text-[12.5px] font-bold uppercase tracking-wide mb-2"
              style={{ color: "var(--text-faint)" }}
            >
              {t("Кейинги қадамни танланг")}
            </p>
            <div className="space-y-2">
              {pool.map((s) => (
                <button
                  key={s}
                  onClick={() => click(s)}
                  className={`w-full rounded-lg border px-3 py-2.5 text-left text-[13.5px] leading-snug transition-all focus-ring ${wrong === s ? "animate-shake" : ""}`}
                  style={{
                    background:
                      wrong === s
                        ? "color-mix(in srgb, var(--bad) 14%, transparent)"
                        : "var(--surface-2)",
                    borderColor: wrong === s ? "var(--bad)" : "var(--border)",
                  }}
                >
                  {t(task.steps[s])}
                </button>
              ))}
            </div>
          </div>
        )}

        {complete && (
          <button
            className="btn btn-primary focus-ring mt-5 w-full"
            onClick={() => {
              if (taskI + 1 >= data.items.length) setDone(true);
              else {
                const n = taskI + 1;
                setTaskI(n);
                loadTask(n);
              }
            }}
          >
            {taskI + 1 >= data.items.length ? t("Якунлаш") : t("Кейинги топшириқ")}
            <Icon name="arrow" className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════ Ҳарфларни тартиблаш ═══════════════ */

export function AnagramGame({ data }: { data: AnagramData }) {
  const { t } = useScript();
  const scramble = (word: string) =>
    shuffle(word.split("")).map((ch) => ({ ch, used: false }));

  const [order, setOrder] = useState<number[]>(() =>
    shuffle(data.items.map((_, idx) => idx)),
  );
  const [i, setI] = useState(0);
  const [letters, setLetters] = useState(() =>
    scramble(t(data.items[order[0]].word)),
  );
  const [built, setBuilt] = useState<number[]>([]);
  const [correct, setCorrect] = useState(0);
  const [checked, setChecked] = useState(false);
  const [done, setDone] = useState(false);

  const item = data.items[order[i]];
  const target = t(item.word);

  /** Кейинги сўзга ўтиш ёки қайта бошлаш учун ҳолатни тозалайди */
  const loadWord = (word: string) => {
    setLetters(scramble(word));
    setBuilt([]);
    setChecked(false);
  };

  const start = () => {
    const o = shuffle(data.items.map((_, idx) => idx));
    setOrder(o);
    setI(0);
    setCorrect(0);
    setDone(false);
    loadWord(t(data.items[o[0]].word));
  };

  if (done)
    return <GameResult correct={correct} total={order.length} onRestart={start} />;

  const word = built.map((b) => letters[b].ch).join("");
  const full = built.length === target.length;
  const ok = word.toLowerCase() === target.toLowerCase();

  return (
    <div>
      <ScoreBar current={i + 1} total={order.length} correct={correct} />
      <div className="card p-6">
        <p
          className="text-[13.5px] mb-4 flex items-center gap-2"
          style={{ color: "var(--text-muted)" }}
        >
          <Icon name="lightbulb" className="w-4 h-4 shrink-0" />
          {t(item.hint)}
        </p>

        {/* Тузилаётган сўз */}
        <div
          className="min-h-16 rounded-xl border-2 border-dashed flex flex-wrap items-center justify-center gap-1.5 p-3"
          style={{
            borderColor: checked
              ? ok
                ? "var(--good)"
                : "var(--bad)"
              : "var(--border-strong)",
          }}
        >
          {built.length === 0 ? (
            <span className="text-[13px]" style={{ color: "var(--text-faint)" }}>
              {t("Ҳарфларни босиб сўз тузинг")}
            </span>
          ) : (
            built.map((b, n) => (
              <button
                key={n}
                disabled={checked}
                onClick={() => {
                  setLetters((ls) =>
                    ls.map((l, li) => (li === b ? { ...l, used: false } : l)),
                  );
                  setBuilt((bs) => bs.filter((_, x) => x !== n));
                }}
                className="w-9 h-10 rounded-lg font-bold text-[16px] uppercase focus-ring"
                style={{ background: "var(--brand)", color: "var(--on-brand)" }}
              >
                {letters[b].ch}
              </button>
            ))
          )}
        </div>

        {/* Мавжуд ҳарфлар */}
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {letters.map((l, li) =>
            l.used ? (
              <span key={li} className="w-9 h-10" />
            ) : (
              <button
                key={li}
                disabled={checked}
                onClick={() => {
                  setLetters((ls) =>
                    ls.map((x, xi) => (xi === li ? { ...x, used: true } : x)),
                  );
                  setBuilt((bs) => [...bs, li]);
                }}
                className="w-9 h-10 rounded-lg border font-bold text-[16px] uppercase transition-colors focus-ring"
                style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
              >
                {l.ch}
              </button>
            ),
          )}
        </div>

        {checked ? (
          <>
            <Feedback
              ok={ok}
              text={ok ? undefined : `${t("Тўғри жавоб")}: ${target}`}
            />
            <button
              className="btn btn-primary focus-ring mt-4 w-full"
              onClick={() => {
                if (i + 1 >= order.length) setDone(true);
                else {
                  const n = i + 1;
                  setI(n);
                  loadWord(t(data.items[order[n]].word));
                }
              }}
            >
              {i + 1 >= order.length ? t("Якунлаш") : t("Кейинги")}
              <Icon name="arrow" className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            className="btn btn-primary focus-ring mt-5 w-full"
            disabled={!full}
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
