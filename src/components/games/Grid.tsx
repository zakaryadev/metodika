"use client";

import { useMemo, useState } from "react";
import type {
  CrosswordData,
  HangmanData,
  WordSearchData,
} from "@/content/games";
import { useScript } from "@/lib/script-context";
import {
  buildCrossword,
  buildWordSearch,
  type Cell,
  type WordSearch,
} from "@/lib/puzzle";
import { Icon } from "../Icons";
import { Feedback, GameResult, ScoreBar, shuffle, alphabetFor } from "./shared";

/* ═══════════════ Сўз излаш ═══════════════ */

export function WordSearchGame({ data }: { data: WordSearchData }) {
  const { t } = useScript();
  const words = useMemo(
    () => data.words.map((w) => t(w).replace(/\s|-/g, "").toUpperCase()),
    [data.words, t],
  );

  const [puzzle, setPuzzle] = useState<WordSearch>(() =>
    buildWordSearch(words, data.size),
  );
  const [found, setFound] = useState<string[]>([]);
  const [start, setStart] = useState<Cell | null>(null);
  const [flash, setFlash] = useState<"ok" | "bad" | null>(null);

  const rebuild = () => {
    setPuzzle(buildWordSearch(words, data.size));
    setFound([]);
    setStart(null);
  };

  const foundCells = useMemo(() => {
    const s = new Set<string>();
    puzzle.placements
      .filter((p) => found.includes(p.word))
      .forEach((p) => p.cells.forEach(([r, c]) => s.add(`${r},${c}`)));
    return s;
  }, [found, puzzle]);

  const placedWords = puzzle.placements.map((p) => p.word);
  const allFound = placedWords.length > 0 && found.length === placedWords.length;

  if (allFound)
    return (
      <GameResult
        correct={found.length}
        total={placedWords.length}
        onRestart={rebuild}
        unit="сўз топилди"
        customScore={`${found.length}`}
      />
    );

  const lineBetween = (a: Cell, b: Cell): Cell[] | null => {
    const dr = Math.sign(b[0] - a[0]);
    const dc = Math.sign(b[1] - a[1]);
    const lenR = Math.abs(b[0] - a[0]);
    const lenC = Math.abs(b[1] - a[1]);
    if (lenR !== 0 && lenC !== 0 && lenR !== lenC) return null;
    const len = Math.max(lenR, lenC);
    const cells: Cell[] = [];
    for (let i = 0; i <= len; i++) cells.push([a[0] + dr * i, a[1] + dc * i]);
    return cells;
  };

  const handleClick = (r: number, c: number) => {
    if (!start) {
      setStart([r, c]);
      return;
    }
    const line = lineBetween(start, [r, c]);
    setStart(null);
    if (!line) {
      setFlash("bad");
      setTimeout(() => setFlash(null), 400);
      return;
    }
    const text = line.map(([rr, cc]) => puzzle.grid[rr][cc]).join("");
    const rev = [...text].reverse().join("");
    const hit = placedWords.find(
      (w) => !found.includes(w) && (w === text || w === rev),
    );
    if (hit) {
      setFound((f) => [...f, hit]);
      setFlash("ok");
    } else {
      setFlash("bad");
    }
    setTimeout(() => setFlash(null), 400);
  };

  return (
    <div>
      <ScoreBar current={found.length} total={placedWords.length} />

      <div className="grid gap-4 lg:grid-cols-[1fr_200px]">
        <div
          className={`card p-2.5 overflow-x-auto ${flash === "bad" ? "animate-shake" : ""}`}
        >
          <div
            className="grid gap-0.5 mx-auto"
            style={{
              gridTemplateColumns: `repeat(${puzzle.size}, minmax(22px, 1fr))`,
              maxWidth: puzzle.size * 34,
            }}
          >
            {puzzle.grid.map((row, r) =>
              row.map((ch, c) => {
                const isFound = foundCells.has(`${r},${c}`);
                const isStart = start?.[0] === r && start?.[1] === c;
                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleClick(r, c)}
                    className="aspect-square rounded text-[12px] sm:text-[13px] font-bold uppercase transition-colors focus-ring"
                    style={{
                      background: isFound
                        ? "var(--good)"
                        : isStart
                          ? "var(--brand)"
                          : "var(--surface-2)",
                      color:
                        isFound || isStart ? "#fff" : "var(--text)",
                    }}
                  >
                    {ch}
                  </button>
                );
              }),
            )}
          </div>
        </div>

        <aside className="card p-4 h-fit">
          <h3
            className="text-[11px] font-bold uppercase tracking-wide mb-2.5"
            style={{ color: "var(--text-faint)" }}
          >
            {t("Топиладиган сўзлар")}
          </h3>
          <ul className="space-y-1.5">
            {placedWords.map((w) => {
              const ok = found.includes(w);
              return (
                <li
                  key={w}
                  className="text-[13px] font-semibold flex items-center gap-1.5"
                  style={{
                    color: ok ? "var(--good)" : "var(--text-muted)",
                    textDecoration: ok ? "line-through" : "none",
                  }}
                >
                  {ok && <Icon name="check" className="w-3.5 h-3.5" />}
                  {w}
                </li>
              );
            })}
          </ul>
          <p
            className="mt-3 text-[11.5px] leading-relaxed"
            style={{ color: "var(--text-faint)" }}
          >
            {t("Сўзнинг биринчи, сўнг охирги ҳарфини босинг")}
          </p>
        </aside>
      </div>
    </div>
  );
}

/* ═══════════════ Кроссворд ═══════════════ */

export function CrosswordGame({ data }: { data: CrosswordData }) {
  const { t } = useScript();

  const translated = useMemo(
    () => data.entries.map((e) => ({ word: t(e.word), clue: e.clue })),
    [data.entries, t],
  );

  const [puzzle, setPuzzle] = useState(() => buildCrossword(translated));
  const [input, setInput] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  const rebuild = () => {
    setPuzzle(buildCrossword(translated));
    setInput({});
    setChecked(false);
    setActive(null);
  };

  const filledCount = Object.values(input).filter((v) => v.trim()).length;
  const totalCells = useMemo(
    () =>
      puzzle.grid.flat().filter((c) => c !== null).length,
    [puzzle],
  );

  const correctCount = useMemo(() => {
    let n = 0;
    puzzle.grid.forEach((row, r) =>
      row.forEach((ch, c) => {
        if (ch && (input[`${r},${c}`] ?? "").toUpperCase() === ch) n++;
      }),
    );
    return n;
  }, [input, puzzle]);

  const solved = totalCells > 0 && correctCount === totalCells;

  if (solved && checked)
    return (
      <GameResult
        correct={puzzle.entries.length}
        total={puzzle.entries.length}
        onRestart={rebuild}
        unit="сўз тўғри ёзилди"
        customScore="100%"
      />
    );

  const activeEntry = puzzle.entries.find((e) => e.number === active);
  const activeCells = new Set<string>();
  if (activeEntry) {
    const dr = activeEntry.dir === "down" ? 1 : 0;
    const dc = activeEntry.dir === "across" ? 1 : 0;
    for (let i = 0; i < activeEntry.word.length; i++) {
      activeCells.add(`${activeEntry.row + dr * i},${activeEntry.col + dc * i}`);
    }
  }

  const numberAt = new Map<string, number>();
  puzzle.entries.forEach((e) => {
    const k = `${e.row},${e.col}`;
    if (!numberAt.has(k)) numberAt.set(k, e.number);
  });

  return (
    <div>
      <ScoreBar current={filledCount} total={totalCells} />

      <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
        <div className="card p-3 overflow-x-auto">
          <div
            className="grid gap-0.5 mx-auto"
            style={{
              gridTemplateColumns: `repeat(${puzzle.cols}, 30px)`,
              width: "fit-content",
            }}
          >
            {puzzle.grid.map((row, r) =>
              row.map((ch, c) => {
                if (ch === null)
                  return <span key={`${r}-${c}`} className="w-[30px] h-[30px]" />;
                const key = `${r},${c}`;
                const val = input[key] ?? "";
                const isActive = activeCells.has(key);
                const isWrong =
                  checked && val && val.toUpperCase() !== ch;
                const isRight = checked && val.toUpperCase() === ch;
                return (
                  <div key={`${r}-${c}`} className="relative">
                    {numberAt.has(key) && (
                      <span
                        className="absolute left-0.5 top-0 text-[8px] font-bold leading-none pointer-events-none z-10"
                        style={{ color: "var(--text-faint)" }}
                      >
                        {numberAt.get(key)}
                      </span>
                    )}
                    <input
                      value={val}
                      maxLength={1}
                      onChange={(e) =>
                        setInput((s) => ({
                          ...s,
                          [key]: e.target.value.slice(-1).toUpperCase(),
                        }))
                      }
                      className="w-[30px] h-[30px] text-center text-[14px] font-bold uppercase border rounded-[4px] outline-none focus-ring"
                      style={{
                        background: isRight
                          ? "color-mix(in srgb, var(--good) 18%, transparent)"
                          : isWrong
                            ? "color-mix(in srgb, var(--bad) 18%, transparent)"
                            : isActive
                              ? "var(--brand-light)"
                              : "var(--surface)",
                        borderColor: isActive
                          ? "var(--brand)"
                          : "var(--border-strong)",
                        color: "var(--text)",
                      }}
                    />
                  </div>
                );
              }),
            )}
          </div>
        </div>

        <aside className="space-y-4">
          {(["across", "down"] as const).map((dir) => {
            const list = puzzle.entries.filter((e) => e.dir === dir);
            if (list.length === 0) return null;
            return (
              <div key={dir} className="card p-4">
                <h3
                  className="text-[11px] font-bold uppercase tracking-wide mb-2"
                  style={{ color: "var(--text-faint)" }}
                >
                  {t(dir === "across" ? "Горизонтал" : "Вертикал")}
                </h3>
                <ul className="space-y-1.5">
                  {list.map((e) => (
                    <li key={`${e.number}-${e.dir}`}>
                      <button
                        onClick={() => setActive(e.number)}
                        className="text-left text-[13px] leading-snug focus-ring rounded w-full"
                        style={{
                          color:
                            active === e.number
                              ? "var(--brand)"
                              : "var(--text-muted)",
                          fontWeight: active === e.number ? 700 : 400,
                        }}
                      >
                        <b>{e.number}.</b> {t(e.clue)}{" "}
                        <span style={{ color: "var(--text-faint)" }}>
                          ({e.word.length})
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </aside>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="btn btn-primary focus-ring"
          onClick={() => setChecked(true)}
          disabled={filledCount === 0}
        >
          <Icon name="check" className="w-4 h-4" />
          {t("Текшириш")}
        </button>
        <button className="btn btn-ghost focus-ring" onClick={rebuild}>
          <Icon name="restart" className="w-4 h-4" />
          {t("Қайтадан")}
        </button>
      </div>

      {checked && !solved && (
        <Feedback
          ok={false}
          text={`${t("Тўғри ёзилган катаклар")}: ${correctCount} / ${totalCells}`}
        />
      )}
    </div>
  );
}

/* ═══════════════ Сўзни топ ═══════════════ */

const MAX_MISTAKES = 7;

export function HangmanGame({ data }: { data: HangmanData }) {
  const { t, script } = useScript();
  const [order, setOrder] = useState<number[]>(() =>
    shuffle(data.items.map((_, idx) => idx)),
  );
  const [i, setI] = useState(0);
  const [guessed, setGuessed] = useState<string[]>([]);
  const [solvedCount, setSolvedCount] = useState(0);
  const [done, setDone] = useState(false);

  const item = data.items[order[i]];
  const word = t(item.word).toUpperCase().replace(/\s/g, "");

  const start = () => {
    setOrder(shuffle(data.items.map((_, idx) => idx)));
    setI(0);
    setGuessed([]);
    setSolvedCount(0);
    setDone(false);
  };

  if (done)
    return <GameResult correct={solvedCount} total={order.length} onRestart={start} />;

  const letters = [...new Set(word.split(""))];
  const mistakes = guessed.filter((g) => !word.includes(g)).length;
  const won = letters.every((l) => guessed.includes(l));
  const lost = mistakes >= MAX_MISTAKES;
  const over = won || lost;

  const next = () => {
    if (won) setSolvedCount((s) => s + 1);
    if (i + 1 >= order.length) setDone(true);
    else {
      setI(i + 1);
      setGuessed([]);
    }
  };

  return (
    <div>
      <ScoreBar current={i + 1} total={order.length} correct={solvedCount} />
      <div className="card p-6">
        <p
          className="text-[13.5px] flex items-center gap-2 mb-5"
          style={{ color: "var(--text-muted)" }}
        >
          <Icon name="lightbulb" className="w-4 h-4 shrink-0" />
          {t(item.hint)}
        </p>

        {/* Яширин сўз */}
        <div className="flex flex-wrap justify-center gap-1.5">
          {word.split("").map((ch, idx) => {
            const shown = guessed.includes(ch) || over;
            return (
              <span
                key={idx}
                className="flex w-8 h-10 items-center justify-center rounded-lg border-b-[3px] text-[17px] font-extrabold uppercase"
                style={{
                  background: "var(--surface-2)",
                  borderColor: over && !guessed.includes(ch)
                    ? "var(--bad)"
                    : "var(--brand)",
                  color: over && !guessed.includes(ch)
                    ? "var(--bad)"
                    : "var(--text)",
                }}
              >
                {shown ? ch : ""}
              </span>
            );
          })}
        </div>

        {/* Хатолар */}
        <div className="mt-5 flex items-center justify-center gap-1.5">
          {Array.from({ length: MAX_MISTAKES }).map((_, n) => (
            <span
              key={n}
              className="w-3 h-3 rounded-full transition-colors"
              style={{
                background:
                  n < mistakes ? "var(--bad)" : "var(--border-strong)",
              }}
            />
          ))}
          <span
            className="ml-2 text-[12.5px] font-bold"
            style={{ color: "var(--text-faint)" }}
          >
            {MAX_MISTAKES - mistakes} {t("уриниш қолди")}
          </span>
        </div>

        {/* Клавиатура */}
        <div className="mt-6 flex flex-wrap justify-center gap-1">
          {alphabetFor(script).map((L) => {
            const used = guessed.includes(L);
            const hit = used && word.includes(L);
            return (
              <button
                key={L}
                disabled={used || over}
                onClick={() => setGuessed((g) => [...g, L])}
                className="w-8 h-9 rounded-md border text-[13px] font-bold transition-colors focus-ring disabled:cursor-default"
                style={{
                  background: used
                    ? hit
                      ? "var(--good)"
                      : "var(--border-strong)"
                    : "var(--surface-2)",
                  color: used ? "#fff" : "var(--text)",
                  borderColor: "var(--border)",
                  opacity: used && !hit ? 0.5 : 1,
                }}
              >
                {L}
              </button>
            );
          })}
        </div>

        {over && (
          <>
            <Feedback
              ok={won}
              text={won ? undefined : `${t("Сўз")}: ${word}`}
            />
            <button className="btn btn-primary focus-ring mt-4 w-full" onClick={next}>
              {i + 1 >= order.length ? t("Якунлаш") : t("Кейинги сўз")}
              <Icon name="arrow" className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
