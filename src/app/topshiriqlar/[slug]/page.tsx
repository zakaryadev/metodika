import { notFound } from "next/navigation";
import { tasks, getTask } from "@/content/tasks";
import { TaskView } from "@/components/TaskView";

export function generateStaticParams() {
  return tasks.map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: PageProps<"/topshiriqlar/[slug]">) {
  const { slug } = await params;
  const x = getTask(slug);
  return { title: x?.title ?? "Топшириқ", description: x?.assignment };
}

export default async function Page({ params }: PageProps<"/topshiriqlar/[slug]">) {
  const { slug } = await params;
  if (!getTask(slug)) notFound();
  return <TaskView slug={slug} />;
}
