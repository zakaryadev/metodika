"use client";

import { getLegalDoc } from "@/content/legal";
import { useScript } from "@/lib/script-context";
import { Icon } from "./Icons";
import { BackLink } from "./ui";

export function LegalView({ slug }: { slug: string }) {
  const { t } = useScript();
  const d = getLegalDoc(slug);
  if (!d) return null;

  return (
    <div className="container-x py-6 max-w-3xl">
      <div className="no-print">
        <BackLink href="/huquqiy-baza" label="Барча ҳужжатлар" />
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip">{t(d.kind)}</span>
          <span
            className="text-[12.5px] font-bold"
            style={{ color: "var(--text-faint)" }}
          >
            {t(d.number)} · {t(d.date)}
          </span>
        </div>
        <h1 className="mt-3 text-xl md:text-2xl font-extrabold leading-tight">
          {t(d.title)}
        </h1>
        <p
          className="mt-3 text-[15px] leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          {t(d.summary)}
        </p>
      </div>

      <section className="card p-6 mt-6">
        <h2 className="flex items-center gap-2 font-bold text-[15px]">
          <Icon name="scale" className="w-4.5 h-4.5" />
          {t("Профилактика ишига тегишли асосий қоидалар")}
        </h2>
        <ul className="mt-4 space-y-3">
          {d.points.map((p, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="flex w-6 h-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                style={{ background: "var(--brand-light)", color: "var(--brand)" }}
              >
                {i + 1}
              </span>
              <span className="text-[14.5px] leading-relaxed">{t(p)}</span>
            </li>
          ))}
        </ul>
      </section>

      {d.url && (
        <a
          href={d.url}
          target="_blank"
          rel="noreferrer"
          className="card card-hover mt-4 flex items-center gap-3 p-5 focus-ring no-print"
        >
          <span
            className="flex w-10 h-10 shrink-0 items-center justify-center rounded-lg text-white"
            style={{ background: "var(--grad-indigo)" }}
          >
            <Icon name="link" className="w-5 h-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-[14.5px]">
              {t("Расмий матнни lex.uz дан ўқиш")}
            </div>
            <div
              className="text-[12.5px] truncate"
              style={{ color: "var(--text-faint)" }}
            >
              {d.url}
            </div>
          </div>
          <Icon name="arrow" className="w-5 h-5 shrink-0" />
        </a>
      )}

      <p
        className="mt-4 text-[12.5px] leading-relaxed"
        style={{ color: "var(--text-faint)" }}
      >
        {t(
          "Эслатма: ҳужжатга ўзгартириш ва қўшимчалар киритилган бўлиши мумкин. Расмий ва долзарб матнни lex.uz сайтидан текшириб кўринг.",
        )}
      </p>
    </div>
  );
}
