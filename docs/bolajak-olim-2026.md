# “Bo‘lajak olim – 2026” tanlovi: muvofiqlik tahlili va ariza loyihasi

> Holat: **qoralama**. `[...]` ichidagi joylar muallif tomonidan to‘ldirilishi yoki tekshirilishi kerak.
> Rasmiy shakllar `startup.ilmiy.uz` platformasida; bu hujjat ularni to‘ldirish uchun matn asosi.

---

## 1-qism. Muvofiqlik tahlili (3-band)

### 1.1. Loyihaning hozirgi holati

`metodika` — voyaga yetmaganlar o‘rtasida huquqbuzarliklar profilaktikasi bo‘yicha **tayyor statik veb-platforma** (Next.js, Supabase faqat ko‘rishlar hisoblagichi uchun). Tarkibi: 9 taqdimot, 10 metod, 16 o‘yin, 6 videodars, 8 topshiriq, 6 test, 5 diagnostika so‘rovnomasi, 8 normativ hujjat.

### 1.2. Talablar bo‘yicha jadval

| Talab | Holat | Izoh |
|---|---|---|
| O‘zbekiston fuqarosi | `[tekshirish]` | Muallif ma'lumoti |
| 40 yoshdan oshmaslik | `[tekshirish]` | Muallif ma'lumoti |
| 1 ishtirokchi — 1 loyiha | `[tekshirish]` | Boshqa ariza topshirilmagan bo‘lishi kerak |
| Muammo yechimiga qaratilgan | ✅ Mos | Muammo: profilaktik ishda yagona zamonaviy metodik baza va ob'ektiv diagnostika yo‘qligi |
| Fan tamoyillariga asoslangan | ⚠️ Qisman | Pedagogik asos bor, lekin diagnostika shkalalari uchun ilmiy manba/validatsiya ko‘rsatilmagan |
| Aniq amalga oshirish mexanizmi, muddat, dastlabki natijalar | ❌ Yo‘q | Bu hujjatning 2-qismida tayyorlanadi |
| Muddat ≤ 1 yil | ✅ Mos bo‘ladi | Reja 10–12 oyga qurilgan |
| Summa ≤ 400 BHM | ⚠️ `[tekshirish]` | BHM 2026-yil uchun amaldagi qiymatini tasdiqlang (oldingi yillardagi qiymatlar: 2025 — 375 000 so‘m). Taxminiy chegara: 400 × BHM |
| Ish haqi to‘lanmaydi | ✅ | Smetada ish haqi moddasi qo‘yilmaydi |
| **Maket / prototip + show-room namunasi** | ❌ **Asosiy to‘siq** | Hozir faqat veb-sayt bor, jismoniy namuna yo‘q |
| Plagiat yo‘q, ma'lumotlar haqqoniy | ⚠️ | Quyidagi 1.3 ga qarang |
| “Muhandis yoshlar innovatsion ishlanmalari” yo‘nalishi | ❌ **Asosiy xavf** | Quyidagi 1.4 ga qarang |

### 1.3. Haqqoniylik va plagiat bo‘yicha xavflar

- `src/content/author.ts` da **to‘ldirilmagan andoza ma'lumotlar** turibdi (“Муаллиф Ф.И.Ш.”, `example@mail.uz`, soxta nashrlar ro‘yxati). Arizada ishlatilsa, “ma'lumotlar haqqoniyligi” talabini buzadi. Haqiqiy ma'lumot bilan almashtiring yoki arizaga olmang.
- README va kontent `lingvometodika.uz` ga **analog** deb yozilgan. Arizada “o‘xshash yechimlar” bo‘limida buni ochiq ko‘rsating, aks holda plagiat/ko‘chirma ayblovi bo‘lishi mumkin. Barcha matn, test va so‘rovnomalarning manbalarini (kim ishlab chiqqan, qaysi adabiyotdan) belgilab chiqing.
- Normativ hujjatlar (`legal.ts`) bo‘limida rekvizitlar “tasdiqlanmagan” deb olib tashlangan (commit `766a448`). Arizaga faqat lex.uz da tekshirilgan hujjatlarni kiriting.

### 1.4. Asosiy xulosa

E'londagi maqsad: *“ilg‘or **muhandis** yoshlarning innovatsion ishlanmalarini **dastlabki prototip** holatiga keltirish”*, natija esa Vazirlik show-room ida joylashtiriladigan maket/prototip. Pedagogik veb-platforma:

1. “Muhandislik ishlanmasi” toifasiga to‘g‘ridan-to‘g‘ri tushmaydi;
2. **allaqachon yaratilgan** — tanlov esa prototipga *keltirish*ni moliyalaydi, tayyor saytni emas;
3. show-room uchun jismoniy namuna talab qilinadi.

**Shu holatda ariza qabul qilinishi ehtimoli past.** Mantiqiy yo‘l — mavjud platformani *poydevor*, yangi **apparat-dasturiy prototipni** esa *tanlov loyihasi* qilib ko‘rsatish (1.5).

### 1.5. Mosligini oshiradigan variantlar

**A (tavsiya).** *Profilaktik diagnostika va o‘yin-trenajyor interaktiv stendi* — maktab/mahalla uchun sensorli kiosk: mavjud 5 ta diagnostika so‘rovnomasi va 16 ta o‘yin dvigateli offline rejimda ishlaydi, natijalar mutaxassisga alohida hisobot bo‘lib chiqadi. Jismoniy maket + dasturiy ta'minot; show-room da namoyish qilish mumkin. Mavjud kod qayta ishlatiladi, shuning uchun 1 yilga va 400 BHM ga sig‘adi.

**B.** Faqat dasturiy yangilanish (shaxsiy kabinet, ma'lumotlar tahlili) — texnik jihatdan yengil, lekin “maket/prototip” va show-room talabini bajarmaydi. Tavsiya etilmaydi.

**C.** Bu tanlovdan voz kechib, pedagogika/ijtimoiy fanlar yo‘nalishidagi boshqa grant yoki tanlovni izlash.

Pastdagi ariza loyihasi **A variant** uchun yozilgan.

---

## 2-qism. Ariza loyihasi (1-band)

### 2.1. Umumiy ma'lumotlar

| Maydon | Qiymat |
|---|---|
| Loyiha nomi | “Profilaktika-stend”: voyaga yetmaganlar xulq-atvoridagi xavfni erta aniqlash va huquqiy tarbiyaning interaktiv apparat-dasturiy kompleksi |
| Muallif / rahbar | `[F.I.Sh., tug‘ilgan sana, JShShIR]` |
| Ish joyi, lavozim | `[to‘ldirish]` |
| Aloqa | `[telefon, e-mail]` |
| Amalga oshirish muddati | 12 oy (`[boshlanish sana]` — `[tugash sana]`) |
| So‘ralayotgan mablag‘ | `[summa]` so‘m (BHMning `[N]` baravari, ≤ 400) |
| Ijrochilar | `[ro‘yxat, ish haqisiz]` |

### 2.2. Muammo

Voyaga yetmaganlar orasida huquqbuzarliklar profilaktikasi bilan sinf rahbarlari, ijtimoiy pedagoglar, psixologlar va profilaktika inspektorlari shug‘ullanadi. Amaliyotda:

- ish usullari tarqoq: yagona, tayyor va qo‘llash oson metodik baza yo‘q;
- xulq-atvordagi xavfni **erta va ob'ektiv** aniqlash vositalari qog‘ozda, qo‘lda hisoblanadi;
- o‘smirlar uchun an'anaviy ma'ruza shakli qiziqarsiz, faol ishtirok yo‘q;
- ko‘p hududlarda (qishloq maktablari, mahallalar) barqaror internet yo‘q.

`[Bu yerga rasmiy statistika va manba qo‘shing: IIV/Prokuratura/Statistika agentligi ma'lumotlari, yil va hujjat nomi bilan. Tekshirilmagan raqam yozmang.]`

### 2.3. Ilmiy asos

Tadqiqot mavzusi: *“Voyaga yetmagan huquqbuzarlar bilan olib boriladigan profilaktik ishlar samaradorligini oshirishning pedagogik shart-sharoitlari”*. Asos:

- pedagogik profilaktika va ijtimoiy moslashuv nazariyasi `[manbalar]`;
- diagnostika shkalalari (xavf darajasi, oilaviy vaziyat, ijtimoiy moslashuv, huquqiy ong, agressivlik) `[har bir so‘rovnomaning ilmiy manbasi va validatsiya holati]`;
- faol o‘qitish metodlari (rolli o‘yin, keys-stadi) `[manbalar]`.

### 2.4. Maqsad va vazifalar

**Maqsad:** mavjud “Metodik platforma” asosida maktab va mahallalarda offline ishlaydigan interaktiv stend prototipini yaratish va sinovdan o‘tkazish.

**Vazifalar:**
1. Texnik topshiriq va foydalanuvchi talablarini 3–5 ta pilot muassasa mutaxassislari bilan kelishish.
2. Mavjud veb-platformani offline (PWA/lokal) rejimga moslashtirish; sensorli ekranli stend korpusini loyihalash.
3. Diagnostika natijalarini mutaxassis uchun hisobotga (PDF/chop etish) aylantirish; shaxsiy ma'lumotlarni lokal saqlash va anonimlashtirish qoidalarini joriy etish.
4. 1 ta prototip yig‘ish va pilot muassasalarda sinash.
5. Sinov natijalari bo‘yicha tuzatish kiritib, namunani Vazirlik show-room iga topshirish.

### 2.5. Amalga oshirish mexanizmi va muddatlar

| Bosqich | Oylar | Natija |
|---|---|---|
| 1. Talablar va TZ | 1–2 | Texnik topshiriq, pilot muassasalar bilan kelishuv |
| 2. Dasturiy ishlab chiqish | 2–6 | Offline versiya, hisobot moduli |
| 3. Apparat qismi | 4–8 | Korpus va sensorli ekran, yig‘ilgan prototip |
| 4. Pilot sinov | 8–10 | `[N]` muassasada sinov, foydalanuvchi fikrlari |
| 5. Yakun | 11–12 | Tuzatilgan namuna show-room da, hisobot |

### 2.6. Dastlabki natijalar (mavjud zaxira)

- 9 taqdimot, 10 metod, 16 o‘yin dvigateli, 6 videodars, 8 topshiriq, 6 test, 5 diagnostika so‘rovnomasi bilan **ishlaydigan veb-platforma** (kirill va lotin yozuvi avtomatik almashadi).
- Statik eksport — serversiz joylashtirish mumkin, bu offline stendga o‘tkazishni osonlashtiradi.
- `[Agar bor bo‘lsa: ko‘rishlar soni, foydalanuvchi fikrlari — Supabase hisoblagichidan haqiqiy raqamni oling.]`

### 2.7. Kutilayotgan natijalar

- 1 ta ishlaydigan stend prototipi va show-room namunasi;
- diagnostika vaqtini qisqartirish (qo‘lda hisoblashdan avtomatik hisobotga) — `[pilotda o‘lchangan qiymat]`;
- pilot muassasalarda mutaxassislar fikri bo‘yicha qo‘llanish tavsiyalari.

Raqamli maqsadli ko‘rsatkichlarni faqat pilotda o‘lchay oladigan darajada yozing.

### 2.8. Smeta (namuna, ish haqisiz)

Narxlarni haqiqiy takliflar bo‘yicha to‘ldiring.

| Modda | Izoh | Summa, so‘m |
|---|---|---|
| Sensorli ekran (`[diagonal]`) | 1 dona | `[ ]` |
| Mini-kompyuter / planshet | 1 dona | `[ ]` |
| Korpus va stend materiallari, yig‘ish | maket | `[ ]` |
| Printer (hisobotni chop etish uchun) | 1 dona | `[ ]` |
| Sinov va tashish xarajatlari | pilot muassasalar | `[ ]` |
| Domen, xosting, litsenziyalar | 12 oy | `[ ]` |
| Ekspert/psixolog xizmati (shartnoma bo‘yicha, ish haqi emas) | so‘rovnomalar validatsiyasi | `[ ]` |
| **Jami** | | `[ ≤ 400 BHM ]` |

Eslatma: “ijrochilarga oylik maosh” moddasi bo‘lmasligi shart. Shartnoma bo‘yicha xizmat ham ish haqi sifatida talqin qilinmasligi uchun tanlov nizomi bilan tekshirib oling.

### 2.9. Xavflar

| Xavf | Chora |
|---|---|
| Voyaga yetmaganlar shaxsiy ma'lumotlari | Faqat lokal saqlash, ism so‘ralmaydi, natija sessiya tugaganda o‘chadi |
| Diagnostikaning ilmiy asosliligi | Mutaxassis tomonidan validatsiya, natijalar “tashxis emas, yo‘naltiruvchi” deb belgilanadi |
| Apparat yetkazib berish kechikishi | Buyurtma 1–2-oyda beriladi |

### 2.10. Mas'uliyat

Taqdim etilgan ma'lumotlar haqqoniyligi va natijalarning o‘z vaqtida bajarilishi uchun loyiha rahbari shaxsan javobgar. Mualliflik huquqi, o‘zlashtirilgan materiallar manbalari ko‘rsatilgan `[ilova]`.

---

## 3-qism. Keyingi qadamlar

1. **Muddatni aniqlang.** E'londagi qabul muddati 13-oktabr (2026) edi, bugun undan keyin. Yangi bosqich yoki muddat uzaytirilganmi — `startup.ilmiy.uz` dan tekshiring.
2. A variantni tanlaysizmi, yo‘qmi hal qiling (1.5).
3. Muallif ma'lumotlari, BHM qiymati, statistika va narxlarni to‘ldiring.
4. Tayyor matnni `startup.ilmiy.uz` shakllariga ko‘chiring.
