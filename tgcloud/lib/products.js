import { products } from '../schema.js';
import { db } from 'sdk';

// Excel dagi asosiy mahsulotlar
export const INITIAL_PRODUCTS = [
  { name: 'Kimchi', unit: 'kg', price: 75000, keywords: 'kimchi kimchi' },
  { name: 'Guruch 30 kg', unit: 'qop', price: 390000, keywords: 'guruch rice' },
  { name: 'Qizil sousi', unit: 'dona', price: 50000, keywords: 'qizil sous sousi' },
  { name: 'Sosiska', unit: 'kg', price: 48000, keywords: 'sosiska sausage' },
  { name: 'Kimbap sabzi 3 kg', unit: 'kon', price: 100000, keywords: 'kimbap sabzi' },
  { name: 'Kimbap turupi 5 kg', unit: 'kon', price: 180000, keywords: 'kimbap turupi' },
  { name: 'Kimbap bodringi 2.5 kg', unit: 'kon', price: 70000, keywords: 'kimbap bodring' },
  { name: 'Kimbap tuxumi', unit: 'kon', price: 200000, keywords: 'kimbap tuxum' },
  { name: 'Kimbap soyasi 5 litr', unit: 'kon', price: 120000, keywords: 'kimbap soya' },
  { name: '3x Chicken 3 kg', unit: 'ta', price: 90000, keywords: '3x chicken tovuq' },
  { name: '5x Chicken 1.8 kg (1 kon)', unit: 'ta', price: 85000, keywords: '5x chicken' },
  { name: 'Corn-dog hamiri 1 kg', unit: 'kg', price: 25000, keywords: 'corn dog hamir' },
  { name: 'Pizza hamiri 30 sm', unit: 'ta', price: 5400, keywords: 'pizza 30' },
  { name: 'Pizza hamiri 35 sm', unit: 'ta', price: 7200, keywords: 'pizza 35' },
  { name: 'Pizza hamiri 40 sm', unit: 'ta', price: 8900, keywords: 'pizza 40' },
  { name: 'Achchiq-Shirin sousi', unit: 'ta', price: 70000, keywords: 'achchiq shirin' },
  { name: 'Bulgogi sousi', unit: 'ta', price: 50000, keywords: 'bulgogi' },
  { name: 'Soya sousi', unit: 'ta', price: 36000, keywords: 'soya sous' },
  { name: 'Lahm (bedro) 5.5 kg (1 kon)', unit: 'kon', price: 550000, keywords: 'lahm bedro' },
  { name: 'Oyoqcha', unit: 'kg', price: 52000, keywords: 'oyoqcha' },
  { name: 'Qanotcha', unit: 'kg', price: 50000, keywords: 'qanotcha' },
  { name: 'Yog\' (Milter) 5 litr (1 dona)', unit: 'ta', price: 115000, keywords: 'yog milter' },
  { name: 'Chopsticks', unit: 'pach', price: 50000, keywords: 'chopsticks tayoq' },
  { name: 'Salafan', unit: 'kg', price: 45000, keywords: 'salafan' },
  { name: 'Pizza korobka (kichik)', unit: 'dona', price: 5700, keywords: 'pizza korobka kichik' },
  { name: 'Pizza korobka (katta)', unit: 'dona', price: 6500, keywords: 'pizza korobka katta' },
  { name: 'Chicken korobka (kichik)', unit: 'dona', price: 2000, keywords: 'chicken korobka kichik' },
  { name: 'Chicken korobka (katta)', unit: 'dona', price: 2500, keywords: 'chicken korobka katta' },
  { name: 'Kimbap korobka', unit: 'dona', price: 1600, keywords: 'kimbap korobka' },
  { name: 'Corn-dog korobka', unit: 'dona', price: 650, keywords: 'corn dog korobka' },
  { name: 'Burger qog\'ozi', unit: 'dona', price: 330, keywords: 'burger qogoz' },
  { name: 'Lavash paketi', unit: 'dona', price: 330, keywords: 'lavash' },
  { name: 'Fri paketi', unit: 'dona', price: 230, keywords: 'fri paket' },
  { name: 'Futbolka', unit: 'dona', price: 90000, keywords: 'futbolka' },
  { name: 'Kepka', unit: 'dona', price: 35000, keywords: 'kepka' },
];

export async function seedProductsIfEmpty() {
  const count = await db.$count(products);
  if (count === 0) {
    for (const p of INITIAL_PRODUCTS) {
      await db.insert(products).values(p).run();
    }
  }
}
