"use client";

import { useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "metodika:theme";

export type Theme = "light" | "dark";

let current: Theme | null = null;
const listeners = new Set<() => void>();

/**
 * Сукут бўйича — ёруғ мавзу. Операцион тизим созламаси атайин
 * ҳисобга олинмайди: қоронғи мавзу фақат фойдаланувчи ўзи танлаганда ёқилади.
 */
function detect(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark") return "dark";
  } catch {
    /* эътиборсиз */
  }
  return "light";
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): Theme {
  if (current === null) current = detect();
  return current;
}

/** Сервер ҳамиша ёруғ режимда рендер қилади; ҳақиқий режим
 *  саҳифа юкланишидан олдин ишга тушувчи скрипт орқали қўйилади. */
function getServerSnapshot(): Theme {
  return "light";
}

export function setTheme(next: Theme): void {
  if (current === next) return;
  current = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* эътиборсиз */
  }
  listeners.forEach((l) => l());
}

export function useTheme(): [Theme, (t: Theme) => void] {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return [theme, setTheme];
}
