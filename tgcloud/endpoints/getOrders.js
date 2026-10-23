import { db } from 'sdk';
import { orders, orderItems } from '../schema.js';
import { desc, eq, sql } from 'sdk/db';

export default async function (input, ctx) {
  // Faqat admin uchun (keyinroq ID tekshiruvi)
  const allOrders = await db.select({
    id: orders.id,
    date: orders.date,
    branch: orders.branch,
    status: orders.status,
    totalAmount: orders.totalAmount,
    itemCount: sql`(SELECT COUNT(*) FROM order_items WHERE order_id = orders.id)`.as('itemCount')
  })
  .from(orders)
  .orderBy(desc(orders.id))
  .limit(30)
  .all();

  return { orders: allOrders };
}
