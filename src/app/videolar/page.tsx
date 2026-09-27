"use client";

import Link from "next/link";
import { videos } from "@/content/videos";
import { useScript } from "@/lib/script-context";
import { Icon } from "@/components/Icons";
import {
  CategoryChip,
  CategoryFilter,
  EmptyState,
  PageHero,
  SearchBox,
  useFiltered,
} from "@/components/ui";
import { ViewCount } from "@/components/ViewCount";

export default function VideolarPage() {
  const { t } = useScript();
  const { query, setQuery, cat, setCat, available, filtered } = useFiltered(
    videos,
    (v) => [v.title, v.description],
  );

  return (
    <>
      <PageHero
        icon="video"
        accent="orange"
        title="Видеодарслар"
        subtitle="Видеоматериаллар — ҳар бири изоҳ ва муҳокама саволлари билан"
        count={videos.length}
        countLabel="та видео"
      />

      <div className="container-x py-7">
        <div className="flex flex-col gap-3 mb-6">
          <div className="max-w-md">
            <SearchBox
              value={query}
              onChange={setQuery}
              placeholder="Видео номи бўйича излаш…"
            />
          </div>
          <CategoryFilter value={cat} onChange={setCat} available={available} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v) => (
              <Link
                key={v.slug}
                href={`/videolar/${v.slug}`}
                className="card card-hover overflow-hidden focus-ring flex flex-col"
              >
                <div
                  className="relative aspect-video flex items-center justify-center"
                  style={{
                    background: v.youtubeId ? "#000" : "var(--surface-2)",
                  }}
                >
                  {v.youtubeId ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon
                      name="video"
                      className="w-10 h-10"
                      />
                  )}
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="flex w-12 h-12 items-center justify-center rounded-full text-white shadow-lg"
                      style={{ background: "var(--grad-orange)" }}
                    >
                      <Icon name="play" className="w-5 h-5 ml-0.5" />
                    </span>
                  </span>
                  <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-bold text-white">
                    {v.duration}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <CategoryChip id={v.category} />
                  <h2 className="mt-2.5 font-bold text-[15px] leading-snug">
                    {t(v.title)}
                  </h2>
                  <p
                    className="mt-1.5 text-[13.5px] leading-relaxed flex-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t(v.description)}
                  </p>
                  <div
                    className="mt-3 text-[12.5px] font-semibold"
                    style={{ color: "var(--text-faint)" }}
                  >
                    <ViewCount slug={v.slug} fallback={v.views} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
