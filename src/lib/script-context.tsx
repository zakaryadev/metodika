"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { toLatin, type Script } from "./translit";

const STORAGE_KEY = "metodika:script";

/* ───────── Ёзув танловини сақловчи ташқи стор ───────── */

let current: Script | null = null;
const listeners = new Set<() => void>();

function readStored(): Script {
  if (current !== null) return current;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    current = saved === "lat" || saved === "cyr" ? saved : "cyr";
  } catch {
    current = "cyr";
  }
  return current;
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): Script {
  return readStored();
}

/** Сервер ҳамиша кириллда рендер қилади — гидратация мос келиши учун */
function getServerSnapshot(): Script {
  return "cyr";
}

function writeScript(s: Script): void {
  if (current === s) return;
  current = s;
  try {
    localStorage.setItem(STORAGE_KEY, s);
  } catch {
    /* localStorage мавжуд бўлмаса — эътиборсиз қолдирамиз */
  }
  listeners.forEach((l) => l());
}

/* ───────── Хук ───────── */

export function useScript() {
  const script = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = script === "lat" ? "uz-Latn" : "uz-Cyrl";
    document.documentElement.dataset.script = script;
  }, [script]);

  const t = useCallback(
    (text: string) => (script === "lat" ? toLatin(text) : text),
    [script],
  );

  return useMemo(
    () => ({ script, setScript: writeScript, t }),
    [script, t],
  );
}

/**
 * Провайдер талаб қилинмайди — ҳолат ташқи сторда сақланади.
 * Компонент илдиз layout да қолдирилган, чунки у кейинчалик
 * қўшимча контекст талаб қилиши мумкин.
 */
export function ScriptProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/** Қисқа ёрдамчи: <T>Матн</T> */
export function T({ children }: { children: string }) {
  const { t } = useScript();
  return <>{t(children)}</>;
}
