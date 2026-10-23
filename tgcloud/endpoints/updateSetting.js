import { setSetting, isAdmin } from '../lib/settings.js';

export default async function (input, ctx) {
  const userId = ctx.initData?.user?.id;
  if (!(await isAdmin(userId))) throw new Error('Ruxsat yo‘q');

  const { key, value } = input;
  if (!key) throw new Error('key kerak');

  const allowed = ['admin_ids', 'warehouse_group_id', 'department_groups', 'branch_name'];
  if (!allowed.includes(key)) throw new Error('Bu sozlama o‘zgartirilmaydi');

  await setSetting(key, value);
  return { success: true };
}
