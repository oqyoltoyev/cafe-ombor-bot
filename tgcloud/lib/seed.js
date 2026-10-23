import { setSetting, getSetting } from './settings.js';

export async function seedDefaultSettings() {
  const existing = await getSetting('admin_ids');
  if (!existing) {
    // Birinchi marta deploy qilganda terminalda o'zgartiring
    await setSetting('admin_ids', '0'); // TODO: o'z Telegram ID
    await setSetting('warehouse_group_id', '0'); // TODO: ombor guruh ID
    await setSetting('department_groups', ''); // ixtiyoriy
    await setSetting('branch_name', 'ESKI SHAHAR');
  }
}
