"use client";

import { useViews } from "@/lib/views";
import { useScript } from "@/lib/script-context";
import { Icon } from "./Icons";

/** Мингликларни ажратиб кўрсатади: 1234 → 1 234 */
function format(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Кўришлар сони. Ҳисоблагич ўчирилган ёки сон ҳали юкланмаган бўлса —
 * ҳеч нарса кўрсатилмайди, шунинг учун уни исталган жойга қўйиш мумкин.
 */
export function ViewCount({
  slug,
  fallback = 0,
  register = false,
  label = "Кўришлар сони",
  className = "",
}: {
  slug: string;
  fallback?: number;
  /** Материал саҳифасида true — кириш ҳисобга олинади */
  register?: boolean;
  label?: string;
  className?: string;
}) {
  const { t } = useScript();
  const count = useViews(slug, { register, fallback });

  if (count === null) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${className}`}
      title={t(label)}
    >
      <Icon name="eye" className="w-3.5 h-3.5" />
      {format(count)}
    </span>
  );
}
