import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <p
        className="text-6xl font-extrabold"
        style={{ color: "var(--border-strong)" }}
      >
        404
      </p>
      <h1 className="mt-4 text-2xl font-extrabold">Саҳифа топилмади</h1>
      <p className="mt-2 text-[15px]" style={{ color: "var(--text-muted)" }}>
        Сиз қидирган саҳифа мавжуд эмас ёки кўчирилган.
      </p>
      <Link href="/" className="btn btn-primary focus-ring mt-6">
        Бош саҳифага қайтиш
      </Link>
    </div>
  );
}
