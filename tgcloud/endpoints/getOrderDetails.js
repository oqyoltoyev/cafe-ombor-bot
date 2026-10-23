import { db } from 'sdk';
import { eq } from 'sdk/db';
import { orderItems, products, orders } from '../schema.js';
import { isAdmin } from '../lib/settings.js';

export default async function (input, ctx) {
  const userId = ctx.initData?.user?.id;
  if (!(await isAdmin(userId))) throw new Error('Ruxsat yo‘q');

  const { orderId } = input;
  if (!orderId) throw new Error('orderId kerak');

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).all();
  if (!order) throw new Error('Topilmadi');

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

  return { order, items };
}
