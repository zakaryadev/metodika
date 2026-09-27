"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

/**
 * Кўришлар ҳисоблагичи (Supabase).
 *
 * Калитлар киритилмаган бўлса, ҳисоблагич бутунлай ўчади ва сайт
 * одатдагидек ишлайверади — ҳеч қаерда хатолик чиқмайди.
 *
 * ДИҚҚАТ: NEXT_PUBLIC_* қийматлари `npm run build` пайтида кодга
 * ёзилади. Калитларни сборкадан ОЛДИН .env файлига қўйиш керак.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Supabase калит номини янгилади: `sb_publishable_…` эски `anon` JWT
// калитининг ўрнини эгаллади. Иккала номни ҳам қабул қиламиз.
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const viewsEnabled = Boolean(SUPABASE_URL && SUPABASE_KEY);

let client: SupabaseClient | null = null;

function db(): SupabaseClient | null {
  if (!viewsEnabled) return null;
  if (!client) {
    client = createClient(SUPABASE_URL as string, SUPABASE_KEY as string, {
      auth: { persistSession: false },
    });
  }
  return client;
}

/**
 * Барча ҳисоблагичлар бир марта юкланади ва кэшда сақланади.
 * `null` қайтса — маълумотни олиб бўлмади (жадвал яратилмаган,
 * тармоқ узилган ва ҳ.к.). Бу ҳолда ҳеч қандай сон кўрсатилмайди:
 * ҳамма жойда «0» чиқиб қолишидан кўра, ҳеч нарса кўрсатмаган маъқул.
 */
let cache: Promise<Map<string, number> | null> | null = null;

function loadAll(): Promise<Map<string, number> | null> {
  // Supabase сўров қурувчиси PromiseLike қайтаради — async функция
  // ичига ўраб, ҳақиқий Promise ҳосил қиламиз.
  if (!cache) {
    cache = (async () => {
      const c = db();
      if (!c) return null;
      try {
        const { data, error } = await c.from("views").select("slug,count");
        if (error || !data) return null;
        return new Map<string, number>(
          data.map((r) => [r.slug as string, r.count as number]),
        );
      } catch {
        return null;
      }
    })();
  }
  return cache;
}

/** Шу сеансда бу саҳифа аллақачон ҳисобланганми? */
function alreadyCounted(slug: string): boolean {
  try {
    return sessionStorage.getItem(`metodika:viewed:${slug}`) === "1";
  } catch {
    return false;
  }
}

function markCounted(slug: string): void {
  try {
    sessionStorage.setItem(`metodika:viewed:${slug}`, "1");
  } catch {
    /* эътиборсиз */
  }
}

type Options = {
  /** true бўлса, кўриш сони биттага оширилади (материал саҳифасида) */
  register?: boolean;
  /** Supabase уланмаган бўлса кўрсатиладиган сон */
  fallback?: number;
};

/**
 * Кўришлар сонини қайтаради. `null` — сон ҳали номаълум
 * (юкланмоқда ёки ҳисоблагич ўчирилган).
 */
export function useViews(slug: string, options: Options = {}): number | null {
  const { register = false, fallback = 0 } = options;

  const [count, setCount] = useState<number | null>(
    viewsEnabled ? null : fallback > 0 ? fallback : null,
  );

  useEffect(() => {
    if (!viewsEnabled) return;
    let alive = true;

    const read = async () => {
      const map = await loadAll();
      if (alive && map) setCount(map.get(slug) ?? 0);
    };

    if (!register || alreadyCounted(slug)) {
      void read();
      return () => {
        alive = false;
      };
    }

    markCounted(slug);

    void (async () => {
      const c = db();
      if (!c) return;
      let data: unknown = null;
      let failed = false;
      try {
        const res = await c.rpc("increment_view", { p_slug: slug });
        data = res.data;
        failed = Boolean(res.error);
      } catch {
        failed = true;
      }
      if (!alive) return;
      if (failed || typeof data !== "number") {
        await read();
        return;
      }
      setCount(data);
      // кэшни ҳам янгилаймиз, рўйхат саҳифасида тўғри сон кўринсин
      const map = await loadAll();
      if (map) map.set(slug, data);
    })();

    return () => {
      alive = false;
    };
  }, [slug, register]);

  return count;
}
