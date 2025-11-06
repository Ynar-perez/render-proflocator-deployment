import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    console.error('Set DATABASE_URL in your environment before running this test.');
    process.exit(1);
  }

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('✅ Connected to Atlas');
    const dbName = uri.split('/').pop().split('?')[0] || 'test';
    const db = client.db(dbName);
    const collections = await db.collections();
    console.log('Collections:', collections.map(c => c.collectionName));
  } catch (err) {
    console.error('Connection error:', err.message || err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

test();
