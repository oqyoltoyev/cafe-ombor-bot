import { table, integer, text, real, boolean, sql } from 'sdk/db';

// Mahsulotlar katalogi (Excel dagi 35 ta mahsulot)
export const products = table('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  unit: text('unit').notNull(), // kg, qop, dona, kon, ta, pach, litr
  price: real('price').notNull(),
  keywords: text('keywords'), // qidiruv uchun qo'shimcha so'zlar
  isActive: boolean('is_active').default(true),
});

// Kunlik buyurtmalar
export const orders = table('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(), // YYYY-MM-DD
  branch: text('branch').default('ESKI SHAHAR'),
  status: text('status').notNull().default('draft'), // draft, pending_approval, approved, sent, receiving, completed
  totalAmount: real('total_amount').default(0),
  createdBy: integer('created_by'),
  approvedBy: integer('approved_by'),
  createdAt: integer('created_at').default(sql`(unixepoch())`),
});

// Buyurtma qatorlari
export const orderItems = table('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').notNull(),
  productId: integer('product_id').notNull(),
  requestedQty: real('requested_qty').notNull().default(0),
  receivedQty: real('received_qty').default(0),
  price: real('price').notNull(),
  note: text('note'),
});

// Guruhlardan kelgan xabarlar (audit uchun)
export const messages = table('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  chatId: integer('chat_id').notNull(),
  userId: integer('user_id'),
  text: text('text'),
  parsed: boolean('parsed').default(false),
  createdAt: integer('created_at').default(sql`(unixepoch())`),
});
