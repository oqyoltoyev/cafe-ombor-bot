import { db } from 'sdk';
import { eq } from 'sdk/db';
import { orderItems, products, orders } from '../schema.js';
import { isAdmin, getWarehouseGroupId } from '../lib/settings.js';
import { api } from 'sdk';

export default async function (input, ctx) {
  const userId = ctx.initData?.user?.id;
  if (!(await isAdmin(userId))) throw new Error('Ruxsat yo‘q');

  const { orderId } = input;
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).all();
  if (!order) throw new Error('Buyurtma topilmadi');

  const items = await db.select({
    name: products.name,
    unit: products.unit,
    requestedQty: orderItems.requestedQty,
    receivedQty: orderItems.receivedQty,
  })
  .from(orderItems)
  .leftJoin(products, eq(orderItems.productId, products.id))
  .where(eq(orderItems.orderId, orderId))
  .all();

  const shortages = items.filter(it => (it.receivedQty || 0) < it.requestedQty);

  if (shortages.length === 0) {
    await db.update(orders).set({ status: 'completed' }).where(eq(orders.id, orderId)).run();
    return { success: true, shortages: 0, message: 'Kamchilik yo‘q' };
  }

  let msg = `⚠️ KAMCHILIK #${order.id}\nSana: ${order.date}\n\n`;
  for (const it of shortages) {
    const diff = it.requestedQty - (it.receivedQty || 0);
    msg += `• ${it.name}: ${diff} ${it.unit} yetishmayapti (keldi: ${it.receivedQty || 0})\n`;
  }

  const warehouseId = await getWarehouseGroupId();
  if (warehouseId) {
    await api.sendMessage({ chat_id: warehouseId, text: msg });
  }

  await db.update(orders).set({ status: 'receiving' }).where(eq(orders.id, orderId)).run();

  return { success: true, shortages: shortages.length };
}
