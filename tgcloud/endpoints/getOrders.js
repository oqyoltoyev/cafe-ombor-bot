import { db } from 'sdk';
import { orders, orderItems } from '../schema.js';
import { desc, sql } from 'sdk/db';
import { isAdmin } from '../lib/settings.js';

export default async function (input, ctx) {
  const userId = ctx.initData?.user?.id;
  if (!(await isAdmin(userId))) {
    throw new Error('Ruxsat yo\u2018q');
  }

  const allOrders = await db.select({
    id: orders.id,
    date: orders.date,
    branch: orders.branch,
    status: orders.status,
    totalAmount: orders.totalAmount,
    itemCount: sql`(SELECT COUNT(*) FROM order_items WHERE order_id = ${orders.id})`.as('itemCount')
  })
  .from(orders)
  .orderBy(desc(orders.id))
  .limit(50)
  .all();

  return { orders: allOrders };
}
