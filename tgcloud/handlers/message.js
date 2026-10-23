import { api, db } from 'sdk';
import { eq, and } from 'sdk/db';
import { orders, orderItems, products } from '../schema.js';
import { parseOrderText } from '../lib/parser.js';
import { seedProductsIfEmpty } from '../lib/products.js';

// Admin ID ni shu yerga yozing (o'zingizning Telegram ID)
const ADMIN_ID = 0; // TODO: o'zingizning ID ni qo'ying

export default async function (message) {
  await seedProductsIfEmpty();

  const text = message.text || '';
  const chatId = message.chat.id;
  const userId = message.from?.id;

  // Admin buyruqlari
  if (userId === ADMIN_ID) {
    if (text === '/start' || text === '/help') {
      await api.sendMessage({
        chat_id: chatId,
        text: `Ombor buyurtma boti (ESKI SHAHAR)\n\n` +
              `/buyurtma - joriy draftni ko'rish\n` +
              `/tasdiqla - admin tasdiqlash\n` +
              `/kamchilik - kamchiliklarni hisoblash\n` +
              `/yangi - yangi kunlik buyurtma boshlash`,
      });
      return;
    }

    if (text === '/yangi') {
      const today = new Date().toISOString().slice(0, 10);
      await db.insert(orders).values({ date: today, status: 'draft' }).run();
      await api.sendMessage({ chat_id: chatId, text: `Yangi draft buyurtma yaratildi: ${today}` });
      return;
    }
  }

  // Oddiy guruh xabarlarini parse qilish
  if (message.chat.type === 'group' || message.chat.type === 'supergroup') {
    const parsed = await parseOrderText(text);
    if (parsed.length === 0) return;

    // Eng so'nggi draft buyurtmani topish
    const [order] = await db.select().from(orders)
      .where(eq(orders.status, 'draft'))
      .orderBy(orders.id, 'desc')
      .limit(1)
      .all();

    if (!order) {
      await api.sendMessage({
        chat_id: chatId,
        text: 'Hozircha faol draft buyurtma yo\'q. Admin /yangi buyrug\'ini bersin.',
      });
      return;
    }

    let added = 0;
    for (const item of parsed) {
      const [existing] = await db.select().from(orderItems)
        .where(and(eq(orderItems.orderId, order.id), eq(orderItems.productId, item.productId)))
        .all();

      if (existing) {
        await db.update(orderItems)
          .set({ requestedQty: existing.requestedQty + item.qty })
          .where(eq(orderItems.id, existing.id))
          .run();
      } else {
        await db.insert(orderItems).values({
          orderId: order.id,
          productId: item.productId,
          requestedQty: item.qty,
          price: item.price,
        }).run();
      }
      added++;
    }

    if (added > 0) {
      await api.sendMessage({
        chat_id: chatId,
        text: `✅ ${added} ta mahsulot buyurtmaga qo'shildi.`,
      });
    }
  }
}
