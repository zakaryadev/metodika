"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useScript } from "@/lib/script-context";
import { toLatin } from "@/lib/translit";
import { categories } from "@/content/categories";
import { Icon } from "./Icons";
import { OrnamentFill } from "./Ornament";
import type { Accent, IconName } from "@/content/site";

/** Акцент рангининг градиент варианти — рангли юзалар учун */
export function accentGradient(a: Accent | string): string {
  return `var(--grad-${a})`;
}

/** Бўлим саҳифаларининг юқори блоки */
export function PageHero({
  icon,
  title,
  subtitle,
  accent = "blue",
  count,
  countLabel,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  accent?: Accent;
  count?: number;
  countLabel?: string;
}) {
  const { t } = useScript();
  return (
    <section
      className="border-b"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <div className="container-x py-8 md:py-10">
        <div className="flex items-start gap-4">
          <div
            className="relative hidden w-12 h-12 shrink-0 items-center justify-center overflow-hidden rounded-xl text-white sm:flex"
            style={{ background: accentGradient(accent) }}
          >
            <OrnamentFill />
            <Icon name={icon} className="relative w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {t(title)}
            </h1>
            <p
              className="mt-1.5 text-[15px] leading-relaxed max-w-2xl"
              style={{ color: "var(--text-muted)" }}
            >
              {t(subtitle)}
            </p>
            {count !== undefined && (
              <div className="mt-3">
                <span className="chip">
                  <b style={{ color: "var(--text)" }}>{count}</b>
                  {t(countLabel ?? "та материал")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SearchBox({
  value,
  onChange,
  placeholder = "Излаш…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const { t } = useScript();
  return (
    <div className="relative">
      <span
        className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: "var(--text-faint)" }}
      >
        <Icon name="search" className="w-4.5 h-4.5" />
      </span>
      <input
        className="input !pl-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t(placeholder)}
        aria-label={t(placeholder)}
      />
    </div>
  );
}

export function CategoryFilter({
  value,
  onChange,
  available,
}: {
  value: string;
  onChange: (v: string) => void;
  available: string[];
}) {
  const { t } = useScript();
  const list = categories.filter((c) => available.includes(c.id));
  if (list.length < 2) return null;

  const items = [{ id: "all", short: "Барчаси" }, ...list];

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((c) => {
        const active = value === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className="rounded-full px-3 py-1.5 text-[13px] font-semibold border transition-colors focus-ring"
            style={
              active
                ? {
                    background: "var(--brand)",
                    color: "var(--on-brand)",
                    borderColor: "var(--brand)",
                  }
                : {
                    background: "var(--surface)",
                    color: "var(--text-muted)",
                    borderColor: "var(--border)",
                  }
            }
          >
            {t(c.short)}
          </button>
        );
      })}
    </div>
  );
}

/** Излаш ва категория бўйича фильтрлаш — иккала ёзувда ҳам ишлайди */
export function useFiltered<T extends { category: string }>(
  items: T[],
  searchFields: (item: T) => string[],
) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");

  const available = useMemo(
    () => Array.from(new Set(items.map((i) => i.category))),
    [items],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const qLat = toLatin(q);
    return items.filter((item) => {
      if (cat !== "all" && item.category !== cat) return false;
      if (!q) return true;
      const hay = searchFields(item).join(" ").toLowerCase();
      return hay.includes(q) || toLatin(hay).includes(qLat);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, query, cat]);

  return { query, setQuery, cat, setCat, available, filtered };
}

export function EmptyState({ text = "Ҳеч нарса топилмади" }: { text?: string }) {
  const { t } = useScript();
  return (
    <div
      className="card p-10 text-center"
      style={{ color: "var(--text-muted)" }}
    >
      <Icon name="search" className="w-8 h-8 mx-auto mb-3 opacity-40" />
      <p className="text-sm font-medium">{t(text)}</p>
    </div>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  const { t } = useScript();
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline focus-ring rounded"
      style={{ color: "var(--brand)" }}
    >
      <Icon name="back" className="w-4 h-4" />
      {t(label)}
    </Link>
  );
}

export function CategoryChip({ id }: { id: string }) {
  const { t } = useScript();
  const c = categories.find((x) => x.id === id);
  if (!c) return null;
  return <span className="chip">{t(c.short)}</span>;
}
