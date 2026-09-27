"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems, authorNav, site } from "@/content/site";
import { useScript } from "@/lib/script-context";
import { useTheme } from "@/lib/theme";
import { Icon, Logo } from "./Icons";

const allNav = [...navItems, authorNav];

function ScriptToggle() {
  const { script, setScript } = useScript();
  return (
    <div
      className="flex items-center rounded-lg border p-0.5 text-xs font-bold"
      style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
      role="group"
      aria-label="Ёзувни танлаш"
    >
      <button
        onClick={() => setScript("cyr")}
        className="rounded-md px-2.5 py-1 transition-colors focus-ring"
        style={{
          background: script === "cyr" ? "var(--brand)" : "transparent",
          color: script === "cyr" ? "var(--on-brand)" : "var(--text-muted)",
        }}
        aria-pressed={script === "cyr"}
      >
        ЎЗ
      </button>
      <button
        onClick={() => setScript("lat")}
        className="rounded-md px-2.5 py-1 transition-colors focus-ring"
        style={{
          background: script === "lat" ? "var(--brand)" : "transparent",
          color: script === "lat" ? "var(--on-brand)" : "var(--text-muted)",
        }}
        aria-pressed={script === "lat"}
      >
        OʻZ
      </button>
    </div>
  );
}

function ThemeToggle() {
  const [theme, set] = useTheme();
  const dark = theme === "dark";

  return (
    <button
      onClick={() => set(dark ? "light" : "dark")}
      className="btn btn-ghost focus-ring !px-2.5"
      aria-label={dark ? "Ёруғ режим" : "Қоронғи режим"}
      title={dark ? "Ёруғ режим" : "Қоронғи режим"}
    >
      <Icon name={dark ? "sun" : "moon"} className="w-4 h-4" />
    </button>
  );
}

export function Header() {
  const pathname = usePathname();
  const { t } = useScript();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className="sticky top-0 z-50 no-print"
      style={{
        background: "color-mix(in srgb, var(--surface) 88%, transparent)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="container-x">
        {/* Юқори қатор */}
        <div className="flex items-center gap-3 py-2.5">
          <Link href="/" className="flex items-center gap-2.5 focus-ring rounded-lg">
            <Logo className="w-9 h-9 shrink-0" />
            <span className="leading-tight">
              <span className="block text-[15px] font-extrabold tracking-tight">
                {t(site.name)}
              </span>
              <span
                className="block text-[11px] font-medium"
                style={{ color: "var(--text-faint)" }}
              >
                {site.domain}
              </span>
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <ScriptToggle />
            <ThemeToggle />
            <button
              className="btn btn-ghost focus-ring !px-2.5 lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Менюни очиш"
              aria-expanded={open}
            >
              <Icon name={open ? "close" : "menu"} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Десктоп навигация */}
        <nav className="hidden lg:flex items-center gap-1 pb-2 overflow-x-auto">
          {allNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13.5px] font-semibold whitespace-nowrap transition-colors focus-ring"
              style={
                isActive(item.href)
                  ? { background: "var(--brand-light)", color: "var(--brand)" }
                  : { color: "var(--text-muted)" }
              }
            >
              <Icon name={item.icon} className="w-4 h-4" />
              {t(item.short)}
            </Link>
          ))}
        </nav>
      </div>

      {/* Мобил меню */}
      {open && (
        <div
          className="lg:hidden border-t animate-pop"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="container-x grid grid-cols-2 gap-1.5 py-3">
            {allNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors focus-ring"
                style={
                  isActive(item.href)
                    ? { background: "var(--brand-light)", color: "var(--brand)" }
                    : { background: "var(--surface-2)", color: "var(--text)" }
                }
              >
                <Icon name={item.icon} className="w-4 h-4 shrink-0" />
                <span className="truncate">{t(item.short)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
