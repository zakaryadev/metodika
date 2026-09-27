export const site = {
  name: "Методик платформа",
  domain: "profilaktika.uz",
  tagline: "Вояга етмаганлар ўртасида ҳуқуқбузарликлар профилактикаси",
  topic:
    "Вояга етмаган ҳуқуқбузарлар билан олиб бориладиган профилактик ишлар самарадорлигини оширишнинг педагогик шарт-шароитлари",
  heroTitle: "Огоҳлантир, йўналтир, қўллаб-қувватла!",
  heroText:
    "Синф раҳбарлари, ижтимоий педагоглар, психологлар ва профилактика инспекторлари учун тайёр методик материаллар — тақдимотлар, интерактив методлар, ўйинлар, диагностика сўровномалари ва ҳуқуқий база. Рўйхатдан ўтмасдан, шу сайтнинг ўзида.",
};

export type NavItem = {
  href: string;
  title: string;
  short: string;
  description: string;
  icon: IconName;
  accent: Accent;
};

export type Accent = "blue" | "violet" | "emerald" | "orange" | "rose" | "cyan" | "amber" | "indigo";

export type IconName =
  | "slides"
  | "book"
  | "game"
  | "video"
  | "task"
  | "test"
  | "chart"
  | "scale"
  | "user";

export const navItems: NavItem[] = [
  {
    href: "/taqdimotlar",
    title: "Тақдимотлар",
    short: "Тақдимотлар",
    description:
      "Профилактика, девиант хулқ ва ҳуқуқий тарбия мавзуларида тайёр слайдли дарслар",
    icon: "slides",
    accent: "blue",
  },
  {
    href: "/metodlar",
    title: "Методлар",
    short: "Методлар",
    description: "Интерактив педагогик методлар — мақсади, босқичлари ва қўлланиши билан",
    icon: "book",
    accent: "violet",
  },
  {
    href: "/oyinlar",
    title: "Ўйинлар",
    short: "Ўйинлар",
    description: "Интерактив ҳуқуқий-тарбиявий ўйинлар — дарҳол ўйналади",
    icon: "game",
    accent: "emerald",
  },
  {
    href: "/videolar",
    title: "Видеодарслар",
    short: "Видео",
    description: "Видеоматериаллар — изоҳ ва муҳокама саволлари билан",
    icon: "video",
    accent: "orange",
  },
  {
    href: "/topshiriqlar",
    title: "Вазиятли топшириқлар",
    short: "Топшириқлар",
    description: "Амалий педагогик вазиятлар — ҳар бири таҳлил топшириғи билан",
    icon: "task",
    accent: "rose",
  },
  {
    href: "/testlar",
    title: "Тестлар",
    short: "Тестлар",
    description: "Билимни текшириш учун тайёр тест синовлари",
    icon: "test",
    accent: "cyan",
  },
  {
    href: "/diagnostika",
    title: "Диагностика",
    short: "Диагностика",
    description: "Хавф даражасини аниқлаш сўровномалари — натижа дарҳол ҳисобланади",
    icon: "chart",
    accent: "amber",
  },
  {
    href: "/huquqiy-baza",
    title: "Ҳуқуқий база",
    short: "Ҳуқуқий база",
    description: "Профилактика соҳасидаги қонунлар ва норматив ҳужжатлар",
    icon: "scale",
    accent: "indigo",
  },
];

export const authorNav: NavItem = {
  href: "/muallif",
  title: "Муаллиф",
  short: "Муаллиф",
  description: "Платформа материаллари муаллифи билан танишинг",
  icon: "user",
  accent: "blue",
};
