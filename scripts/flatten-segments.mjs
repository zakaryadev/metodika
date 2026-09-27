/**
 * Статик экспортдан кейинги тузатиш.
 *
 * Next.js 16 `output: "export"` режимида навигация учун олдиндан
 * юкланадиган RSC сегмент файлларини ичма-ич папка сифатида ёзади:
 *   out/oyinlar/huquqiy-test/__next.oyinlar/$d$slug/__PAGE__.txt
 * Браузер эса уларни нуқта билан бирлаштирилган ясси ном билан сўрайди:
 *   /oyinlar/huquqiy-test/__next.oyinlar.$d$slug.__PAGE__.txt
 *
 * Оддий статик хостингда бу 404 хатоларига олиб келади. Скрипт ҳар бир
 * `__next.*` папкасидаги файлларни ёнига ясси ном билан нусхалайди.
 * Папкалар ўчирилмайди — иккала йўл ҳам ишлайверади.
 */

import { readdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const OUT = path.resolve(process.cwd(), "out");
let copied = 0;

/** `__next.*` папкасини рекурсив равишда ясси файлларга ёяди */
async function flatten(targetDir, prefix, dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await flatten(targetDir, `${prefix}.${entry.name}`, full);
    } else if (entry.isFile()) {
      await copyFile(full, path.join(targetDir, `${prefix}.${entry.name}`));
      copied++;
    }
  }
}

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (entry.name === "_next") continue;
    if (entry.name.startsWith("__next.")) {
      await flatten(dir, entry.name, full);
      continue; // ичига қайта кирмаймиз — flatten аллақачон ўтди
    }
    await walk(full);
  }
}

if (!existsSync(OUT)) {
  console.log("flatten-segments: out/ папкаси йўқ — ўтказиб юборилди");
} else {
  await walk(OUT);
  console.log(`flatten-segments: ${copied} та сегмент файли ясси номга нусхаланди`);
}
