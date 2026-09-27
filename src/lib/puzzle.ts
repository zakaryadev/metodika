/** Сўз излаш ва кроссворд тузиш алгоритмлари */

export type Cell = [number, number];

export type WordSearch = {
  grid: string[][];
  placements: { word: string; cells: Cell[] }[];
  size: number;
};

const DIRS: Cell[] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [-1, 1],
  [0, -1],
  [-1, 0],
  [-1, -1],
  [1, -1],
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Тўлдириш учун — жойлаштирилган сўзлардаги ҳарфлардан фойдаланамиз */
function fillerPool(words: string[]): string[] {
  const set = new Set<string>();
  words.forEach((w) => w.split("").forEach((ch) => set.add(ch)));
  const pool = [...set].filter((c) => c.trim());
  return pool.length ? pool : ["А", "Б", "В", "Г", "Д"];
}

export function buildWordSearch(rawWords: string[], size: number): WordSearch {
  const words = rawWords
    .map((w) => w.replace(/\s|-/g, "").toUpperCase())
    .filter((w) => w.length > 1 && w.length <= size)
    .sort((a, b) => b.length - a.length);

  const grid: (string | null)[][] = Array.from({ length: size }, () =>
    Array<string | null>(size).fill(null),
  );
  const placements: { word: string; cells: Cell[] }[] = [];

  for (const w of words) {
    let placed = false;
    for (let attempt = 0; attempt < 400 && !placed; attempt++) {
      const [dr, dc] = pick(DIRS);
      const r0 = Math.floor(Math.random() * size);
      const c0 = Math.floor(Math.random() * size);
      const cells: Cell[] = [];
      let ok = true;

      for (let i = 0; i < w.length; i++) {
        const r = r0 + dr * i;
        const c = c0 + dc * i;
        if (r < 0 || r >= size || c < 0 || c >= size) {
          ok = false;
          break;
        }
        const cur = grid[r][c];
        if (cur !== null && cur !== w[i]) {
          ok = false;
          break;
        }
        cells.push([r, c]);
      }

      if (!ok) continue;
      cells.forEach(([r, c], i) => {
        grid[r][c] = w[i];
      });
      placements.push({ word: w, cells });
      placed = true;
    }
  }

  const pool = fillerPool(placements.map((p) => p.word));
  const full: string[][] = grid.map((row) =>
    row.map((ch) => ch ?? pick(pool)),
  );

  return { grid: full, placements, size };
}

/* ═══════════════ Кроссворд ═══════════════ */

export type CrosswordEntry = {
  word: string;
  clue: string;
  row: number;
  col: number;
  dir: "across" | "down";
  number: number;
};

export type Crossword = {
  entries: CrosswordEntry[];
  rows: number;
  cols: number;
  /** grid[r][c] — шу катакдаги ҳарф ёки null */
  grid: (string | null)[][];
};

type Placed = {
  word: string;
  clue: string;
  row: number;
  col: number;
  dir: "across" | "down";
};

function canPlace(
  cells: Map<string, string>,
  word: string,
  row: number,
  col: number,
  dir: "across" | "down",
): boolean {
  const dr = dir === "down" ? 1 : 0;
  const dc = dir === "across" ? 1 : 0;

  // Сўздан олдинги ва кейинги катак бўш бўлиши керак
  const beforeKey = `${row - dr},${col - dc}`;
  const afterKey = `${row + dr * word.length},${col + dc * word.length}`;
  if (cells.has(beforeKey) || cells.has(afterKey)) return false;

  let intersections = 0;
  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    const existing = cells.get(`${r},${c}`);

    if (existing) {
      if (existing !== word[i]) return false;
      intersections++;
    } else {
      // Ён катаклар бўш бўлиши керак (кесишмаган жойда)
      const sideA = dir === "across" ? `${r - 1},${c}` : `${r},${c - 1}`;
      const sideB = dir === "across" ? `${r + 1},${c}` : `${r},${c + 1}`;
      if (cells.has(sideA) || cells.has(sideB)) return false;
    }
  }
  return intersections > 0;
}

export function buildCrossword(
  raw: { word: string; clue: string }[],
): Crossword {
  const items = raw
    .map((e) => ({ ...e, word: e.word.replace(/\s|-/g, "").toUpperCase() }))
    .filter((e) => e.word.length > 1)
    .sort((a, b) => b.word.length - a.word.length);

  if (items.length === 0)
    return { entries: [], rows: 0, cols: 0, grid: [] };

  const cells = new Map<string, string>();
  const placed: Placed[] = [];

  const commit = (p: Placed) => {
    const dr = p.dir === "down" ? 1 : 0;
    const dc = p.dir === "across" ? 1 : 0;
    for (let i = 0; i < p.word.length; i++) {
      cells.set(`${p.row + dr * i},${p.col + dc * i}`, p.word[i]);
    }
    placed.push(p);
  };

  // Биринчи сўз — марказда, горизонтал
  commit({ ...items[0], row: 0, col: 0, dir: "across" });

  const leftovers: typeof items = [];

  for (const item of items.slice(1)) {
    let done = false;
    for (const p of placed) {
      if (done) break;
      const dir = p.dir === "across" ? "down" : "across";
      for (let pi = 0; pi < p.word.length && !done; pi++) {
        const ch = p.word[pi];
        for (let wi = 0; wi < item.word.length && !done; wi++) {
          if (item.word[wi] !== ch) continue;
          const pr = p.row + (p.dir === "down" ? pi : 0);
          const pc = p.col + (p.dir === "across" ? pi : 0);
          const row = dir === "down" ? pr - wi : pr;
          const col = dir === "across" ? pc - wi : pc;
          if (canPlace(cells, item.word, row, col, dir)) {
            commit({ ...item, row, col, dir });
            done = true;
          }
        }
      }
    }
    if (!done) leftovers.push(item);
  }

  // Координаталарни нормаллаштириш
  const rowsArr = [...cells.keys()].map((k) => Number(k.split(",")[0]));
  const colsArr = [...cells.keys()].map((k) => Number(k.split(",")[1]));
  const minR = Math.min(...rowsArr);
  const minC = Math.min(...colsArr);
  const rows = Math.max(...rowsArr) - minR + 1;
  const cols = Math.max(...colsArr) - minC + 1;

  const grid: (string | null)[][] = Array.from({ length: rows }, () =>
    Array<string | null>(cols).fill(null),
  );
  cells.forEach((ch, key) => {
    const [r, c] = key.split(",").map(Number);
    grid[r - minR][c - minC] = ch;
  });

  // Рақамлаш: юқоридан пастга, чапдан ўнгга
  const normalized = placed
    .map((p) => ({ ...p, row: p.row - minR, col: p.col - minC }))
    .sort((a, b) => a.row - b.row || a.col - b.col);

  const numberByCell = new Map<string, number>();
  let counter = 0;
  const entries: CrosswordEntry[] = normalized.map((p) => {
    const key = `${p.row},${p.col}`;
    let num = numberByCell.get(key);
    if (num === undefined) {
      num = ++counter;
      numberByCell.set(key, num);
    }
    return { ...p, number: num };
  });

  // Жойлаштирилмаган сўзлар (агар бўлса) — эътиборга олинмайди,
  // фойдаланувчига фақат жойлашганлари кўрсатилади.
  void leftovers;

  return { entries, rows, cols, grid };
}
