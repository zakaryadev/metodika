"use client";

import { author } from "@/content/author";
import { site } from "@/content/site";
import { useScript } from "@/lib/script-context";
import { Icon } from "@/components/Icons";
import { OrnamentFill, OrnamentMedallion } from "@/components/Ornament";

function Section({
  icon,
  title,
  items,
}: {
  icon: string;
  title: string;
  items: string[];
}) {
  const { t } = useScript();
  if (items.length === 0) return null;
  return (
    <div className="card p-5">
      <h2 className="flex items-center gap-2 font-bold text-[15px]">
        <Icon name={icon} className="w-4.5 h-4.5" />
        {t(title)}
      </h2>
      <ul className="mt-3 space-y-2">
        {items.map((x, i) => (
          <li key={i} className="flex gap-2.5 text-[14px] leading-relaxed">
            <span
              className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: "var(--brand)" }}
            />
            <span style={{ color: "var(--text-muted)" }}>{t(x)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MuallifPage() {
  const { t } = useScript();
  const a = author;

  const contacts = [
    { icon: "mail", label: a.email, href: `mailto:${a.email}` },
    { icon: "phone", label: a.phone, href: `tel:${a.phone.replace(/\s/g, "")}` },
    { icon: "send", label: "Telegram", href: a.telegram },
  ];

  return (
    <>
      <section className="container-x pt-6">
        <div className="hero-grad relative overflow-hidden rounded-2xl px-6 py-9 md:px-10 md:py-12 text-white">
          <OrnamentMedallion size={360} />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative flex w-20 h-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/15 text-3xl font-extrabold">
              <OrnamentFill opacity={0.25} />
              <span className="relative">{a.name.trim().charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-extrabold">{t(a.name)}</h1>
              <p className="mt-1.5 text-[15px] opacity-90">{t(a.role)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {contacts.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-[13px] font-semibold hover:bg-white/25 transition-colors"
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                  >
                    <Icon name={c.icon} className="w-4 h-4" />
                    {c.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-x py-8 grid gap-4 lg:grid-cols-2">
        <div className="card p-5 lg:col-span-2">
          <h2 className="flex items-center gap-2 font-bold text-[15px]">
            <Icon name="user" className="w-4.5 h-4.5" />
            {t("Тадқиқот ҳақида")}
          </h2>
          <p
            className="mt-3 text-[14.5px] leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {t(a.bio)}
          </p>
          <div
            className="mt-4 rounded-xl px-4 py-3.5"
            style={{ background: "var(--brand-light)" }}
          >
            <div
              className="text-[11px] font-bold uppercase tracking-wide"
              style={{ color: "var(--text-faint)" }}
            >
              {t("Диссертация мавзуси")}
            </div>
            <p className="mt-1 text-[14px] font-semibold leading-relaxed">
              {t(site.topic)}
            </p>
          </div>
        </div>

        <Section icon="book" title="Таълим" items={a.education} />
        <Section icon="users" title="Иш тажрибаси" items={a.experience} />
        <Section icon="slides" title="Нашрлар" items={a.publications} />
        <Section icon="target" title="Ютуқлар" items={a.achievements} />
      </div>
    </>
  );
}
