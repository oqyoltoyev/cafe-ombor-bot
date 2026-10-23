import { api, db } from 'sdk';
import { eq, and, desc } from 'sdk/db';
import { orders, orderItems, products, messages } from '../schema.js';
import { parseOrderText } from '../lib/parser.js';
import { seedProductsIfEmpty } from '../lib/products.js';
import { seedDefaultSettings, makeFirstAdmin } from '../lib/seed.js';
import { isAdmin, getDepartmentGroups, getSetting } from '../lib/settings.js';

export default async function (message) {
  await seedProductsIfEmpty();
  await seedDefaultSettings();

  const text = (message.text || '').trim();
  const chatId = message.chat.id;
  const userId = message.from?.id;

  if (!text || !userId) return;

  await db.insert(messages).values({ chatId, userId, text }).run();

  // Birinchi marta: /start yoki /setup qilgan odam admin bo‘ladi
  const setupDone = await getSetting('setup_done');
  if (setupDone !== 'true' && (text === '/start' || text === '/setup' || text === '/admin')) {
    const became = await makeFirstAdmin(userId);
    if (became) {
      await api.sendMessage({
        chat_id: chatId,
        text: `\u2705 Siz birinchi admin bo\u2018ldingiz!\n\nEndi Mini App orqali ombor guruh ID va boshqa sozlamalarni kiriting.`,
        reply_markup: {
          inline_keyboard: [[
            { text: '\ud83d\udcf1 Admin Panelni ochish', web_app: { url: process.env.MINI_APP_URL || 'https://app.tgcloud.ai' } }
          ]]
        }
      });
      return;
    }
  }

  if (await isAdmin(userId)) {
    if (text === '/start' || text === '/help' || text === '/admin') {
      await api.sendMessage({
        chat_id: chatId,
        text: `\ud83d\udce6 Ombor Bot\n\n` +
              `/yangi \u2014 yangi kunlik buyurtma\n` +
              `/holat \u2014 joriy draft\n` +
              `/mini \u2014 Admin panel\n\n` +
              `Barcha sozlamalar Mini App da.`,
        reply_markup: {
          inline_keyboard: [[
            { text: '\ud83d\udcf1 Admin Panel', web_app: { url: process.env.MINI_APP_URL || 'https://app.tgcloud.ai' } }
          ]]
        }
      });
      return;
    }

    if (text === '/yangi') {
      const today = new Date().toISOString().slice(0, 10);
      await db.insert(orders).values({ date: today, status: 'draft', createdBy: userId }).run();
      await api.sendMessage({ chat_id: chatId, text: `\u2705 Yangi draft yaratildi: ${today}` });
      return;
    }

    if (text === '/holat') {
      const [order] = await db.select().from(orders).where(eq(orders.status, 'draft')).orderBy(desc(orders.id)).limit(1).all();
      if (!order) {
        await api.sendMessage({ chat_id: chatId, text: 'Faol draft yo\u2018q. /yangi bosing.' });
        return;
      }
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id)).all();
      await api.sendMessage({ chat_id: chatId, text: `Draft #${order.id} (${order.date})\n${items.length} ta mahsulot.` });
      return;
    }
  }

  // Guruhlardan buyurtma / qabul
  const deptGroups = await getDepartmentGroups();
  const isDeptGroup = deptGroups.length === 0 || deptGroups.includes(Number(chatId));

  if ((message.chat.type === 'group' || message.chat.type === 'supergroup') && isDeptGroup) {
    if (/^(keldi|qabul|received)[:\s]/i.test(text)) {
      await handleReception(text, chatId);
      return;
    }

    const parsed = await parseOrderText(text);
    if (parsed.length === 0) return;

    const [order] = await db.select().from(orders)
      .where(eq(orders.status, 'draft'))
      .orderBy(desc(orders.id))
      .limit(1)
      .all();

    if (!order) {
      await api.sendMessage({
        chat_id: chatId,
        text: 'Hozircha faol draft yo\u2018q. Admin /yangi buyrug\u2018ini bersin.',
        reply_to_message_id: message.message_id
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
        text: `\u2705 ${added} ta mahsulot draftga qo\u2018shildi.`,
        reply_to_message_id: message.message_id
      });
    }
  }
}

async function handleReception(text, chatId) {
  const [order] = await db.select().from(orders)
    .where(eq(orders.status, 'sent'))
    .orderBy(desc(orders.id))
    .limit(1)
    .all();

  if (!order) {
    await api.sendMessage({ chat_id: chatId, text: 'Faol yuborilgan buyurtma yo\u2018q.' });
    return;
  }

  const parsed = await parseOrderText(text.replace(/^(keldi|qabul|received)[:\s]*/i, ''));
  let updated = 0;

  for (const item of parsed) {
    const [row] = await db.select().from(orderItems)
      .where(and(eq(orderItems.orderId, order.id), eq(orderItems.productId, item.productId)))
      .all();

    if (row) {
      await db.update(orderItems)
        .set({ receivedQty: item.qty })
        .where(eq(orderItems.id, row.id))
        .run();
      updated++;
    }
  }

  if (updated > 0) {
    await api.sendMessage({
      chat_id: chatId,
      text: `\u2705 ${updated} ta mahsulot qabul qilindi. Kamchilik uchun Mini App dan foydalaning.`
    });
  }
}
