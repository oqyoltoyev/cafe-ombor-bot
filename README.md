# Cafe Ombor Bot — Production Beta

Telegram Serverless + React Mini App (iOS uslubi) asosidagi to‘liq ombor buyurtma tizimi.

## Asosiy imkoniyatlar

- Bo‘lim guruhlarida oddiy matn yozilsa bot mahsulotni aniqlaydi va draft buyurtmaga qo‘shadi
- Admin Mini App orqali buyurtmani ko‘rib, ombor guruhiga yuboradi
- Ishchilar “keldi: kimchi 2, sosiska 4” deb yozsa qabul qilinadi
- Faqat kamchiliklar ombor guruhiga yuboriladi
- Barcha sozlamalar (admin ID, guruh ID lar) Mini App dan o‘zgartiriladi
- Excel dagi 35 ta mahsulot katalogi avtomatik

## Birinchi marta ishga tushirish (juda oson)

1. **Bot yarating**  
   @BotFather → `/newbot` → Serverless ni yoqing → CLI Access token oling.

2. **Loyihani oling**
   ```bash
   git clone https://github.com/oqyoltoyev/cafe-ombor-bot.git
   cd cafe-ombor-bot
   npm install
   ```

3. **Birinchi sozlamalar** (terminalda)  
   `tgcloud/lib/seed.js` faylini oching va quyidagilarni o‘zingizniki bilan almashtiring:
   ```js
   await setSetting('admin_ids', '123456789');           // o‘z Telegram ID
   await setSetting('warehouse_group_id', '-100123456'); // ombor guruh ID
   ```
   Keyin saqlang.

4. **Deploy**
   ```bash
   npx tgcloud login          # tokenni kiriting
   npm run deploy
   ```

5. **Mini App ni ulash**  
   Deploydan keyin terminalda chiqadigan `https://appXXXX.tgcloud.ai` manzilini oling.  
   @BotFather → bot → Mini App → URL ga shu manzilni qo‘ying.

6. **Botni guruhlarga qo‘shing**  
   - Bo‘lim guruhlari (buyurtma yoziladigan)
   - Ombor guruhi

## Kundalik ishlatish

| Kim | Nima qiladi |
|-----|-------------|
| Bo‘lim | Guruhda: `kimchi 2 kg, sosiska 5` |
| Admin | Mini App da “Ombor ga yuborish” |
| Ishchi | Guruhda: `keldi: kimchi 2, sosiska 4` |
| Admin | Mini App da “Kamchilikni yuborish” |

## Muhim eslatmalar

- Birinchi deploydan keyin sozlamalarni Mini App orqali o‘zgartirish mumkin (Settings tab).
- Admin ID ni o‘zgartirsangiz, yangi admin Mini App ga kira oladi.
- Bot tokeni kodda yo‘q — Serverless o‘zi boshqaradi.
- Production uchun yetarli darajada xavfsiz (admin tekshiruvi, verified initData).

**Beta.** Asosiy oqim to‘liq ishlaydi. Keyinroq Excel eksport, batafsil statistika qo‘shish mumkin.
