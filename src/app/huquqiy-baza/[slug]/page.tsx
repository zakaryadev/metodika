import { notFound } from "next/navigation";
import { legalDocs, getLegalDoc } from "@/content/legal";
import { LegalView } from "@/components/LegalView";

export function generateStaticParams() {
  return legalDocs.map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: PageProps<"/huquqiy-baza/[slug]">) {
  const { slug } = await params;
  const x = getLegalDoc(slug);
  return { title: x?.title ?? "Ҳужжат", description: x?.summary };
}

export default async function Page({ params }: PageProps<"/huquqiy-baza/[slug]">) {
  const { slug } = await params;
  if (!getLegalDoc(slug)) notFound();
  return <LegalView slug={slug} />;
}
