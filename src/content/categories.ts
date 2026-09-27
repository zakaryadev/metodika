import type { Category } from "./types";

export const categories: Category[] = [
  { id: "nazariy", title: "Назарий асослар", short: "Назарий" },
  { id: "huquqiy", title: "Ҳуқуқий-норматив асослар", short: "Ҳуқуқий" },
  { id: "profilaktika", title: "Профилактика методикаси", short: "Профилактика" },
  { id: "diagnostika", title: "Психологик-педагогик диагностика", short: "Диагностика" },
  { id: "oila", title: "Оила ва маҳалла билан ишлаш", short: "Оила ва маҳалла" },
  { id: "deviant", title: "Девиант хулқ-атвор", short: "Девиант хулқ" },
  { id: "konikma", title: "Ижтимоий кўникмалар", short: "Кўникмалар" },
];

export const categoryMap: Record<string, Category> = Object.fromEntries(
  categories.map((c) => [c.id, c]),
);

export function categoryTitle(id: string): string {
  return categoryMap[id]?.short ?? id;
}
