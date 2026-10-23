import { db } from 'sdk';
import { eq } from 'sdk/db';
import { settings } from '../schema.js';

export async function getSetting(key, defaultValue = null) {
  const [row] = await db.select().from(settings).where(eq(settings.key, key)).all();
  return row ? row.value : defaultValue;
}

export async function setSetting(key, value) {
  await db.insert(settings).values({ key, value: String(value) }).onConflictDoUpdate({
    target: settings.key,
    set: { value: String(value) }
  }).run();
}

export async function getAdminIds() {
  const raw = await getSetting('admin_ids', '');
  return raw.split(',').map(s => parseInt(s.trim())).filter(Boolean);
}

export async function isAdmin(userId) {
  if (!userId) return false;
  const ids = await getAdminIds();
  return ids.includes(Number(userId));
}

export async function getWarehouseGroupId() {
  const id = await getSetting('warehouse_group_id');
  return id ? Number(id) : null;
}

export async function getDepartmentGroups() {
  const raw = await getSetting('department_groups', '');
  return raw.split(',').map(s => parseInt(s.trim())).filter(Boolean);
}
