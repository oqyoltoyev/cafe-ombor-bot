import { db } from 'sdk';
import { settings } from '../schema.js';
import { isAdmin } from '../lib/settings.js';

export default async function (input, ctx) {
  const userId = ctx.initData?.user?.id;
  if (!(await isAdmin(userId))) throw new Error('Ruxsat yo‘q');

  const rows = await db.select().from(settings).all();
  const result = {};
  for (const r of rows) result[r.key] = r.value;
  return { settings: result };
}
