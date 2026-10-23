import { db, api } from 'sdk';
import { eq } from 'sdk/db';
import { orders } from '../schema.js';

export default async function (input, ctx) {
  const { orderId } = input;
  if (!orderId) throw new Error('orderId kerak');

  await db.update(orders)
    .set({ status: 'approved', approvedBy: ctx.initData?.user?.id })
    .where(eq(orders.id, orderId))
    .run();

  // Keyinroq ombor guruhiga yuborish qo'shiladi
  return { success: true, status: 'approved' };
}
