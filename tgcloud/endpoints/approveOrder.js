import { db, api } from 'sdk';
import { eq } from 'sdk/db';
import { orders, orderItems, products } from '../schema.js';
import { isAdmin, getWarehouseGroupId, getSetting } from '../lib/settings.js';

export default async function (input, ctx) {
  const userId = ctx.initData?.user?.id;
  if (!(await isAdmin(userId))) throw new Error('Ruxsat yo\u2018q');

  const { orderId } = input;
  if (!orderId) throw new Error('orderId kerak');

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).all();
  if (!order) throw new Error('Buyurtma topilmadi');

  const items = await db.select({
    id: orderItems.id,
    name: products.name,
    unit: products.unit,
    requestedQty: orderItems.requestedQty,
    receivedQty: orderItems.receivedQty,
    price: orderItems.price,
  })
  .from(orderItems)
  .leftJoin(products, eq(orderItems.productId, products.id))
  .where(eq(orderItems.orderId, orderId))
  .all();

  // Format message for warehouse
  let msg = `\ud83d\udce6 BUYURTMA #${order.id}\n`;
  msg += `Sana: ${order.date}\n`;
  msg += `Filial: ${order.branch}\n\n`;

  let total = 0;
  for (const it of items) {
    const sum = it.requestedQty * it.price;
    total += sum;
    msg += `\u2022 ${it.name}: ${it.requestedQty} ${it.unit}\n`;
  }
  msg += `\nJami: ${total.toLocaleString()} so\u2018m`;

  const warehouseId = await getWarehouseGroupId();
  if (!warehouseId) throw new Error('Ombor guruh ID sozlanmagan');

  const sent = await api.sendMessage({
    chat_id: warehouseId,
    text: msg,
  });

  await db.update(orders)
    .set({ 
      status: 'sent', 
      approvedBy: userId,
      warehouseMessageId: sent.message_id,
      totalAmount: total
    })
    .where(eq(orders.id, orderId))
    .run();

  return { success: true, status: 'sent', messageId: sent.message_id };
}
