import { notFound } from "next/navigation";
import { methods, getMethod } from "@/content/methods";
import { MethodView } from "@/components/MethodView";

export function generateStaticParams() {
  return methods.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/metodlar/[slug]">) {
  const { slug } = await params;
  const m = getMethod(slug);
  return { title: m?.title ?? "Метод", description: m?.summary };
}

export default async function Page({ params }: PageProps<"/metodlar/[slug]">) {
  const { slug } = await params;
  if (!getMethod(slug)) notFound();
  return <MethodView slug={slug} />;
}
