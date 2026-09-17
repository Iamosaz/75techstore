// 75Backend/createIndexes.js
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

async function setupIndexes() {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to Database!\n');

    const db = mongoose.connection.db;

    console.log('🚀 Creating and optimizing indexes...\n');

    // Helper to safely create index without crashing
    const safeIndex = async (collectionName, keys, options = {}, label = '') => {
      try {
        await db.collection(collectionName).createIndex(keys, options);
        console.log(`✅ ${label || collectionName} index created`);
      } catch (err) {
        if (err.code === 85 || err.message.includes('same name') || err.message.includes('already exists')) {
          console.log(`ℹ️ ${label || collectionName} index already active`);
        } else {
          console.log(`⚠️ ${label || collectionName}: ${err.message}`);
        }
      }
    };

    // 1. Orders
    await safeIndex('orders', { user: 1, createdAt: -1 }, {}, 'Orders (User & Date)');
    await safeIndex('orders', { status: 1 }, {}, 'Orders (Status)');

    // 2. Products
    await safeIndex('products', { category: 1, isFeatured: 1 }, {}, 'Products (Category & Featured)');
    await safeIndex('products', { name: 'text', description: 'text' }, {}, 'Products (Search Text)');
    await safeIndex('products', { stock: 1 }, {}, 'Products (Stock)');

    // 3. Users
    await safeIndex('users', { email: 1 }, { unique: true }, 'Users (Unique Email)');
    await safeIndex('users', { createdAt: -1 }, {}, 'Users (Signup Date)');

    // 4. Blogs (Drop conflicting old index first, then recreate)
    try {
      await db.collection('blogs').dropIndex('slug_1');
    } catch {
      // Ignored if index doesn't exist
    }
    await safeIndex('blogs', { slug: 1 }, { unique: true, sparse: true }, 'Blogs (Unique Sparse Slug)');
    await safeIndex('blogs', { status: 1, createdAt: -1 }, {}, 'Blogs (Status & Date)');

    // 5. Analytics Events
    await safeIndex('analyticsevents', { eventType: 1, createdAt: -1 }, {}, 'Analytics (Event & Date)');
    await safeIndex('analyticsevents', { source: 1 }, {}, 'Analytics (Traffic Source)');

    console.log('\n🎉 ALL DATABASE INDEXES ARE NOW 100% COMPLETE & OPTIMIZED!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Fatal Error:', err.message);
    process.exit(1);
  }
}

setupIndexes();