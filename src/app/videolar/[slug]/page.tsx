import { notFound } from "next/navigation";
import { videos, getVideo } from "@/content/videos";
import { VideoView } from "@/components/VideoView";

export function generateStaticParams() {
  return videos.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/videolar/[slug]">) {
  const { slug } = await params;
  const v = getVideo(slug);
  return { title: v?.title ?? "Видеодарс", description: v?.description };
}

export default async function Page({ params }: PageProps<"/videolar/[slug]">) {
  const { slug } = await params;
  if (!getVideo(slug)) notFound();
  return <VideoView slug={slug} />;
}
