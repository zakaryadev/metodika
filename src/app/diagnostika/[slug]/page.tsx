import { notFound } from "next/navigation";
import { diagnostics, getDiagnostic } from "@/content/diagnostics";
import { DiagnosticRunner } from "@/components/DiagnosticRunner";

export function generateStaticParams() {
  return diagnostics.map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: PageProps<"/diagnostika/[slug]">) {
  const { slug } = await params;
  const x = getDiagnostic(slug);
  return { title: x?.title ?? "Диагностика", description: x?.description };
}

export default async function Page({ params }: PageProps<"/diagnostika/[slug]">) {
  const { slug } = await params;
  if (!getDiagnostic(slug)) notFound();
  return <DiagnosticRunner slug={slug} />;
}
