/**
 * Ўзбек кирилл → лотин транслитерацияси.
 * Барча контент кириллча сақланади, лотинча вариант шу ердa ҳосил қилинади.
 */

const VOWELS_CYR = "аеёиоуэюяўАЕЁИОУЭЮЯЎ";

/** Бир ҳарфли мосликлар */
const SIMPLE: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", ж: "j", з: "z", и: "i",
  й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "x", ч: "ch", ш: "sh",
  э: "e", ю: "yu", я: "ya", ё: "yo",
  ў: "o\u02BB", қ: "q", ғ: "g\u02BB", ҳ: "h",
  ъ: "\u02BC", ь: "", ы: "i", щ: "shch",
};

/** Транслитерация қилинмайдиган махсус сўзлар (атоқли отлар, қисқартмалар) */
const EXCEPTIONS: Record<string, string> = {
  иив: "IIB",
  иибб: "IIBB",
  бмт: "BMT",
  юнисеф: "UNICEF",
  унисеф: "UNICEF",
};

function isUpper(ch: string): boolean {
  return ch !== ch.toLowerCase() && ch === ch.toUpperCase();
}

/**
 * Кичик ҳарфли натижани манба ҳарфининг регистрига мослаштиради.
 * Кейинги ҳарф ҳам катта бўлса — бутунлай катта (ЁШЛАР → YOSHLAR),
 * акс ҳолда фақат биринчи ҳарф катта (Ёшлар → Yoshlar).
 */
function applyCase(out: string, srcChar: string, nextChar: string): string {
  if (!isUpper(srcChar)) return out;
  const nextIsUpper = nextChar !== "" && isUpper(nextChar);
  if (nextIsUpper || out.length === 1) return out.toUpperCase();
  return out.charAt(0).toUpperCase() + out.slice(1);
}

/** «е» → сўз бошида ва унлидан кейин «ye», акс ҳолда «e» */
function mapYe(prev: string): string {
  if (prev === "" || VOWELS_CYR.includes(prev) || prev === "ъ" || prev === "ь") {
    return "ye";
  }
  return "e";
}

/** «ц» → сўз бошида «s», сўз ичида «ts» */
function mapTs(prev: string): string {
  return prev === "" ? "s" : "ts";
}

function translitWord(word: string): string {
  const lower = word.toLowerCase();
  if (EXCEPTIONS[lower]) {
    return isUpper(word[0] ?? "") ? EXCEPTIONS[lower] : EXCEPTIONS[lower].toLowerCase();
  }

  let out = "";
  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    const low = ch.toLowerCase();
    const prev = i > 0 ? word[i - 1].toLowerCase() : "";
    const next = i + 1 < word.length ? word[i + 1] : "";

    let mapped: string | undefined;
    if (low === "ъ" && "еёюя".includes(next.toLowerCase())) {
      // рус ўзлашмаларида айирув белгиси тушади: съезд → syezd
      mapped = "";
    } else if (low === "е") mapped = mapYe(prev);
    else if (low === "ц") mapped = mapTs(prev);
    else mapped = SIMPLE[low];

    if (mapped === undefined) {
      out += ch; // кирилл бўлмаган белги — ўзгаришсиз
    } else if (mapped === "") {
      // «ь» — тушириб қолдирилади
    } else {
      out += applyCase(mapped, ch, next);
    }
  }
  return out;
}

const CYRILLIC_RE = /[\u0400-\u04FF\u0500-\u052F]/;

/** Матнни ўзбек лотин ёзувига ўгиради. Кирилл бўлмаган матн ўзгармайди. */
export function toLatin(text: string): string {
  if (!text || !CYRILLIC_RE.test(text)) return text;
  return text.replace(/[\p{L}\u02BB\u02BC]+/gu, (w) => translitWord(w));
}

export type Script = "cyr" | "lat";

/** Танланган ёзувга қараб матнни қайтаради. */
export function tr(text: string, script: Script): string {
  return script === "lat" ? toLatin(text) : text;
}
