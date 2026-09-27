import { notFound } from "next/navigation";
import { presentations, getPresentation } from "@/content/presentations";
import { PresentationViewer } from "@/components/PresentationViewer";

export function generateStaticParams() {
  return presentations.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/taqdimotlar/[slug]">) {
  const { slug } = await params;
  const p = getPresentation(slug);
  return { title: p?.title ?? "Тақдимот", description: p?.description };
}

export default async function Page({ params }: PageProps<"/taqdimotlar/[slug]">) {
  const { slug } = await params;
  if (!getPresentation(slug)) notFound();
  return <PresentationViewer slug={slug} />;
}
