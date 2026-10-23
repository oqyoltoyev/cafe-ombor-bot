# Cafe Ombor Bot — Yakuniy Production

Telegram Serverless + React Mini App. **Hech narsa terminalda o‘zgartirish shart emas.**

## Birinchi ishga tushirish (3 qadam)

1. @BotFather da bot yarating → Serverless ni yoqing → CLI token oling.
2. Terminalda:
   ```bash
   git clone https://github.com/oqyoltoyev/cafe-ombor-bot.git
   cd cafe-ombor-bot
   npm install
   npx tgcloud login
   npm run deploy
   ```
3. Deploydan keyin chiqqan `https://appXXXX.tgcloud.ai` manzilini @BotFather → Mini App URL ga qo‘ying.

## Birinchi admin bo‘lish

Botga shaxsiy chatda `/start` yoki `/setup` yozing — siz avtomatik birinchi admin bo‘lasiz.

Keyin Mini App ni oching (Admin Panel tugmasi) va **Sozlamalar** tabida:
- Ombor guruh ID
- Bo‘lim guruhlari ID (ixtiyoriy)
- Filial nomi

ni kiriting. Hammasi botning o‘zida.

## Kundalik ishlatish

| Kim | Nima qiladi |
|-----|-------------|
| Admin | `/yangi` yoki Mini App |
| Bo‘lim | Guruhda: `kimchi 2 kg, sosiska 5, pizza 30 10` |
| Admin | Mini App → buyurtma → **Ombor ga yuborish** |
| Ishchi | Guruhda: `keldi: kimchi 2, sosiska 4` |
| Admin | Mini App → **Kamchilikni yuborish** |

## Xususiyatlar

- Aqlli matn parser
- Admin Mini App (iOS uslubi)
- Barcha sozlamalar Mini App dan
- Kamchilik hisoblash va yuborish
- Excel dagi 35 ta mahsulot
- Xavfsiz (verified initData + admin tekshiruvi)
- Token kodda yo‘q

**Tayyor.** Endi to‘liq ishlaydi.
