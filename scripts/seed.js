import { MongoClient } from 'mongodb';
import { profData } from '../data/prof.js';

// =================================================================
// IMPORTANT:
// 1. Replace the placeholder connection string with your actual string from Atlas.
// 2. Replace <password> with the password for your database user.
// =================================================================
const uri = "mongodb+srv://proflocator:proflocatorwithmongodb@proflocatorcluster.4jv4auv.mongodb.net/?retryWrites=true&w=majority&appName=ProfLocatorCluster";

const client = new MongoClient(uri);

async function seedDatabase() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log("✅ Connected successfully to MongoDB Atlas!");

    const database = client.db("profLocatorDB");
    const collection = database.collection("professors");

    // Optional: Delete existing documents to prevent duplicates on re-run
    const deleteResult = await collection.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing documents.`);

    // Insert the professor data
    const insertResult = await collection.insertMany(profData);
    console.log(`🌱 Seeded ${insertResult.insertedCount} new documents.`);

  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("🚪 Connection closed.");
  }
}

// Run the seeding function
seedDatabase();