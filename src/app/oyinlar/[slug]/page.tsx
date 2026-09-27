import { notFound } from "next/navigation";
import { games, getGame } from "@/content/games";
import { GamePlayer } from "@/components/GamePlayer";

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/oyinlar/[slug]">) {
  const { slug } = await params;
  const g = getGame(slug);
  return { title: g?.title ?? "Ўйин", description: g?.description };
}

export default async function Page({ params }: PageProps<"/oyinlar/[slug]">) {
  const { slug } = await params;
  if (!getGame(slug)) notFound();
  return <GamePlayer slug={slug} />;
}
