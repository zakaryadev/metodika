/**
 * Миллий нақш (`public/naqsh.png`) — безак қатлами.
 *
 * Нақш ҳамиша алоҳида, `absolute inset-0` қатлам сифатида қўйилади.
 * Уни бевосита `background-image` орқали бермаслик керак: ранг одатда
 * инлайн `background: …` қисқартмаси билан берилади ва у `background-image`
 * ни ўчириб юборади.
 *
 * Қамровчи элементда `position: relative` (медальон учун яна
 * `overflow: hidden`) бўлиши шарт, нақш устидаги матн ва белгиларда эса —
 * `relative`, акс ҳолда улар нақш остида қолиб кетади.
 */

const SRC = "url(/naqsh.png)";

/** Такрорланувчи нақш — карточка шапкалари учун */
export function OrnamentTile({
  size = 90,
  opacity = 0.15,
  className = "",
}: {
  size?: number;
  opacity?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: SRC,
        backgroundSize: `${size}px ${size}px`,
        backgroundRepeat: "repeat",
        opacity,
      }}
    />
  );
}

/** Битта катта нақш — hero нинг ўнг четида (катта экранларда) */
export function OrnamentMedallion({
  size = 420,
  opacity = 0.2,
  className = "",
}: {
  size?: number;
  opacity?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute top-1/2 -right-16 hidden -translate-y-1/2 lg:block ${className}`}
      style={{
        width: size,
        height: size,
        backgroundImage: SRC,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        opacity,
      }}
    />
  );
}

/** Кичик квадратни тўлдирувчи нақш — логотип ва белги плиткалари учун */
export function OrnamentFill({
  opacity = 0.3,
  className = "",
}: {
  opacity?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: SRC,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity,
      }}
    />
  );
}
