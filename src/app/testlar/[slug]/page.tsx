import { notFound } from "next/navigation";
import { tests, getTest } from "@/content/tests";
import { TestRunner } from "@/components/TestRunner";

export function generateStaticParams() {
  return tests.map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: PageProps<"/testlar/[slug]">) {
  const { slug } = await params;
  const x = getTest(slug);
  return { title: x?.title ?? "Тест", description: x?.description };
}

export default async function Page({ params }: PageProps<"/testlar/[slug]">) {
  const { slug } = await params;
  if (!getTest(slug)) notFound();
  return <TestRunner slug={slug} />;
}
