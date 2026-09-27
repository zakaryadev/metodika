"use client";

import { getVideo } from "@/content/videos";
import { useScript } from "@/lib/script-context";
import { Icon } from "./Icons";
import { ViewCount } from "./ViewCount";
import { BackLink, CategoryChip } from "./ui";

export function VideoView({ slug }: { slug: string }) {
  const { t } = useScript();
  const v = getVideo(slug);
  if (!v) return null;

  return (
    <div className="container-x py-6">
      <BackLink href="/videolar" label="Барча видеодарслар" />

      <div className="mt-4 max-w-3xl">
        <CategoryChip id={v.category} />
        <h1 className="mt-2 text-xl md:text-2xl font-extrabold leading-tight">
          {t(v.title)}
        </h1>
        <p
          className="mt-2 text-[15px] leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          {t(v.description)}
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <div
            className="card overflow-hidden aspect-video flex items-center justify-center"
            style={{ background: v.youtubeId ? "#000" : "var(--surface-2)" }}
          >
            {v.youtubeId ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                title={v.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="text-center px-6">
                <Icon
                  name="video"
                  className="w-10 h-10 mx-auto mb-3 opacity-40"
                />
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t("Видео тез орада жойлаштирилади")}
                </p>
                <p
                  className="mt-1 text-xs"
                  style={{ color: "var(--text-faint)" }}
                >
                  {t("Видеони қўшиш учун контент файлида youtubeId ни тўлдиринг")}
                </p>
              </div>
            )}
          </div>

          <div
            className="mt-3 flex items-center gap-4 text-[13px] font-semibold"
            style={{ color: "var(--text-faint)" }}
          >
            <span className="flex items-center gap-1.5">
              <Icon name="clock" className="w-4 h-4" />
              {v.duration}
            </span>
            <ViewCount slug={v.slug} fallback={v.views} register />
          </div>
        </div>

        <aside>
          <div className="card p-5">
            <h2 className="flex items-center gap-2 font-bold text-[15px]">
              <Icon name="lightbulb" className="w-4.5 h-4.5" />
              {t("Муҳокама саволлари")}
            </h2>
            <p
              className="mt-1.5 text-[12.5px] leading-relaxed"
              style={{ color: "var(--text-faint)" }}
            >
              {t("Видеони кўргач, шу саволлар бўйича суҳбат ўтказинг")}
            </p>
            <ol className="mt-3 space-y-2.5">
              {v.questions.map((q, i) => (
                <li key={i} className="flex gap-2.5">
                  <span
                    className="flex w-6 h-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                    style={{ background: "var(--brand-light)", color: "var(--brand)" }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="text-[13.5px] leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t(q)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
