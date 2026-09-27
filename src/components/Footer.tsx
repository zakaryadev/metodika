"use client";

import Link from "next/link";
import { navItems, authorNav, site } from "@/content/site";
import { useScript } from "@/lib/script-context";
import { Logo } from "./Icons";
import { OrnamentTile } from "./Ornament";

export function Footer() {
  const { t } = useScript();
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative mt-16 overflow-hidden text-white no-print"
      style={{ background: "var(--grad-footer)" }}
    >
      <OrnamentTile size={160} opacity={0.07} />

      <div className="container-x relative py-10">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo className="w-9 h-9" />
              <span className="text-[15px] font-extrabold">{t(site.name)}</span>
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
              {t(site.topic)}
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-white/50">
              {t("Бўлимлар")}
            </h3>
            <ul className="space-y-1.5">
              {navItems.slice(0, 5).map((i) => (
                <li key={i.href}>
                  <Link
                    href={i.href}
                    className="rounded text-sm text-white/75 transition-colors hover:text-white focus-ring"
                  >
                    {t(i.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-white/50">
              {t("Қўшимча")}
            </h3>
            <ul className="space-y-1.5">
              {[...navItems.slice(5), authorNav].map((i) => (
                <li key={i.href}>
                  <Link
                    href={i.href}
                    className="rounded text-sm text-white/75 transition-colors hover:text-white focus-ring"
                  >
                    {t(i.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/15 pt-5 text-xs text-white/55">
          <span>
            © {year} {t(site.name)}
          </span>
          <span>
            {t("Методик материаллар — таълим мақсадида эркин фойдаланиш учун")}
          </span>
        </div>
      </div>
    </footer>
  );
}
