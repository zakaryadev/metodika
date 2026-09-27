"use client";

import { getMethod } from "@/content/methods";
import { useScript } from "@/lib/script-context";
import { Icon } from "./Icons";
import { ViewCount } from "./ViewCount";
import { BackLink, CategoryChip } from "./ui";

export function MethodView({ slug }: { slug: string }) {
  const { t } = useScript();
  const m = getMethod(slug);
  if (!m) return null;

  const facts = [
    { icon: "clock" as const, label: "Давомийлиги", value: m.duration },
    { icon: "users" as const, label: "Иштирокчилар", value: m.participants },
    { icon: "layers" as const, label: "Босқичлар", value: `${m.steps.length} та` },
  ];

  return (
    <div className="container-x py-6">
      <div className="no-print">
        <BackLink href="/metodlar" label="Барча методлар" />
      </div>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-3xl">
          <CategoryChip id={m.category} />
          <h1 className="mt-2 text-xl md:text-3xl font-extrabold leading-tight">
            {t(m.title)}
          </h1>
          <p
            className="mt-2 text-[15px] leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {t(m.summary)}
          </p>
          <div
            className="mt-2 text-[12.5px] font-semibold"
            style={{ color: "var(--text-faint)" }}
          >
            <ViewCount slug={m.slug} fallback={m.views} register />
          </div>
        </div>
        <button
          className="btn btn-ghost focus-ring no-print shrink-0"
          onClick={() => window.print()}
        >
          <Icon name="print" className="w-4 h-4" />
          <span className="hidden sm:inline">{t("Чоп этиш")}</span>
        </button>
      </div>

      {/* Маълумот блоклари */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {facts.map((f) => (
          <div key={f.label} className="card p-4 flex items-center gap-3">
            <span
              className="flex w-9 h-9 shrink-0 items-center justify-center rounded-lg"
              style={{ background: "var(--brand-light)", color: "var(--brand)" }}
            >
              <Icon name={f.icon} className="w-4.5 h-4.5" />
            </span>
            <div className="min-w-0">
              <div
                className="text-[11px] font-bold uppercase tracking-wide"
                style={{ color: "var(--text-faint)" }}
              >
                {t(f.label)}
              </div>
              <div className="text-[13.5px] font-semibold leading-snug">
                {t(f.value)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="order-2 lg:order-1">
          <h2 className="text-lg font-extrabold mb-3">{t("Ўтказиш босқичлари")}</h2>
          <ol className="space-y-3">
            {m.steps.map((s, i) => (
              <li key={i} className="card p-5 flex gap-4">
                <span
                  className="flex w-8 h-8 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold text-white"
                  style={{ background: "var(--violet)" }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold text-[15px] leading-snug">{t(s.title)}</h3>
                  <p
                    className="mt-1.5 text-[14px] leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t(s.text)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside className="order-1 lg:order-2 space-y-4">
          <div className="card p-5">
            <h3 className="flex items-center gap-2 font-bold text-[14px]">
              <Icon name="target" className="w-4.5 h-4.5" />
              {t("Мақсад")}
            </h3>
            <p
              className="mt-2 text-[13.5px] leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {t(m.goal)}
            </p>
          </div>

          <div className="card p-5">
            <h3 className="flex items-center gap-2 font-bold text-[14px]">
              <Icon name="task" className="w-4.5 h-4.5" />
              {t("Зарур материаллар")}
            </h3>
            <ul className="mt-2 space-y-1.5">
              {m.materials.map((x, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-[13.5px] leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: "var(--violet)" }}
                  />
                  {t(x)}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="card p-5"
            style={{ background: "var(--brand-light)", borderColor: "transparent" }}
          >
            <h3 className="flex items-center gap-2 font-bold text-[14px]">
              <Icon name="check" className="w-4.5 h-4.5" />
              {t("Кутилаётган натижа")}
            </h3>
            <p
              className="mt-2 text-[13.5px] leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {t(m.result)}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
