/** Платформа контентининг умумий типлари. Барча матн — ўзбек кириллчасида. */

export type CategoryId =
  | "nazariy"
  | "huquqiy"
  | "profilaktika"
  | "diagnostika"
  | "oila"
  | "deviant"
  | "konikma";

export type Category = {
  id: CategoryId;
  title: string;
  short: string;
};

export type Slide = {
  title: string;
  bullets: string[];
  note?: string;
};

export type Presentation = {
  slug: string;
  title: string;
  category: CategoryId;
  description: string;
  views: number;
  slides: Slide[];
};

export type Method = {
  slug: string;
  title: string;
  category: CategoryId;
  summary: string;
  goal: string;
  duration: string;
  participants: string;
  materials: string[];
  steps: { title: string; text: string }[];
  result: string;
  views: number;
};

export type VideoItem = {
  slug: string;
  title: string;
  category: CategoryId;
  description: string;
  /** YouTube видео ID. Бўш бўлса — жой эгаллаб турувчи блок кўрсатилади. */
  youtubeId: string;
  duration: string;
  questions: string[];
  views: number;
};

export type TaskItem = {
  slug: string;
  title: string;
  category: CategoryId;
  /** Вазият матни — ўқувчи/мутахассис таҳлил қилади */
  situation: string;
  assignment: string;
  hints: string[];
  views: number;
};

export type TestItem = {
  slug: string;
  title: string;
  category: CategoryId;
  description: string;
  questionCount: number;
  questions: { q: string; options: string[]; answer: number; explain?: string }[];
  views: number;
};

/** Диагностика — баллга асосланган сўровнома */
export type Diagnostic = {
  slug: string;
  title: string;
  category: CategoryId;
  audience: string;
  description: string;
  instruction: string;
  /** Ҳар бир савол учун жавоб шкаласи */
  scale: { label: string; value: number }[];
  questions: string[];
  /** Натижа оралиқлари — йиғилган балл бўйича */
  bands: { min: number; max: number; level: string; tone: "low" | "mid" | "high"; advice: string }[];
  views: number;
};

export type LegalDoc = {
  slug: string;
  title: string;
  kind: string;
  /** Ҳужжат рақами — lex.uz дан текширилган бўлсагина тўлдирилади */
  number?: string;
  date?: string;
  summary: string;
  /** Профилактика ишига тегишли асосий моддалар/қоидалар */
  points: string[];
  url?: string;
  /** true — рақам, сана ва ҳавола ҳали текширилмаган */
  needsCitation?: boolean;
};

export type Author = {
  name: string;
  role: string;
  email: string;
  phone: string;
  telegram: string;
  bio: string;
  education: string[];
  experience: string[];
  publications: string[];
  achievements: string[];
};
