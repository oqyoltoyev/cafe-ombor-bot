import { db } from 'sdk';
import { eq, like, or } from 'sdk/db';
import { products } from '../schema.js';

// Oddiy, lekin aqlli parser
// "kimchi 2 kg, sosiska 5, pizza 30 10 ta" kabi matnlarni tushunadi
export async function parseOrderText(text) {
  if (!text) return [];
  const lines = text.toLowerCase()
    .replace(/[,;]/g, '\n')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  const results = [];
  const allProducts = await db.select().from(products).where(eq(products.isActive, true)).all();

  for (const line of lines) {
    // Raqamni topish
    const numMatch = line.match(/(\d+(?:[.,]\d+)?)/);
    if (!numMatch) continue;
    const qty = parseFloat(numMatch[1].replace(',', '.'));
    if (isNaN(qty) || qty <= 0) continue;

    // Mahsulot nomini qidirish
    let bestMatch = null;
    let bestScore = 0;

    for (const p of allProducts) {
      const names = [p.name, p.keywords || ''].join(' ').toLowerCase();
      const words = line.split(/\s+/);
      let score = 0;
      for (const w of words) {
        if (w.length < 3) continue;
        if (names.includes(w)) score += w.length;
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = p;
      }
    }

    if (bestMatch && bestScore >= 4) {
      results.push({
        productId: bestMatch.id,
        name: bestMatch.name,
        unit: bestMatch.unit,
        price: bestMatch.price,
        qty,
      });
    }
  }

  return results;
}
