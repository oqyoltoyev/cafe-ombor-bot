import { setSetting, getSetting } from './settings.js';

export async function seedDefaultSettings() {
  const existing = await getSetting('admin_ids');
  if (!existing) {
    await setSetting('admin_ids', ''); // bo‘sh = hali hech kim admin emas
    await setSetting('warehouse_group_id', '');
    await setSetting('department_groups', '');
    await setSetting('branch_name', 'ESKI SHAHAR');
    await setSetting('setup_done', 'false');
  }
}

export async function makeFirstAdmin(userId) {
  const current = await getSetting('admin_ids', '');
  if (!current || current === '0' || current === '') {
    await setSetting('admin_ids', String(userId));
    await setSetting('setup_done', 'true');
    return true;
  }
  return false;
}
