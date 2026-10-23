# Cafe Ombor Bot + Admin Mini App (Beta)

Telegram Serverless asosidagi professional ombor buyurtma tizimi.

## Imkoniyatlar

- Guruhdagi matnni aqlli parser bilan buyurtmaga aylantirish
- Admin uchun **iOS uslubidagi React Mini App** (Telegram ichida ochiladi)
- Draft → Tasdiqlash → Ombor guruhiga yuborish oqimi
- SQLite’da saqlash
- Telegram Serverless hosting (Mini App + Endpoints)

## Mini App

Admin panel `https://app<APP_ID>.tgcloud.ai` da ochiladi.  
BotFather da Mini App URL ni shu manzilga qo‘ying.

## O‘rnatish va Deploy

1. @BotFather da bot yarating va Serverless ni yoqing.
2. CLI token oling.
3. Ushbu repodan clone qiling yoki yuklab oling.
4. Terminalda:

```bash
npm install
npx tgcloud login
npm run deploy
```

5. `tgcloud/handlers/message.js` da ADMIN_ID ni o‘zgartiring.
6. BotFather → Mini App sozlamalarida URL ni kiriting.

## Strukturasi

- `tgcloud/` — bot backend (handlers, endpoints, schema)
- `src/` — React Mini App (iOS dizayn)
- `dist/` — build natijasi (deploy qilinadi)

**Beta versiya.** Keyingi qadamlar: kamchilik hisoblash, to‘liq tasdiqlash oqimi, mahsulot katalogini boshqarish.
