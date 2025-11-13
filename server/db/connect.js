// db/connect.js
import { MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URL;

if (!uri) {
  console.error("DATABASE_URL not found in .env file");
  process.exit(1);
}

const client = new MongoClient(uri);

// Derive database name
const databaseName = process.env.DATABASE_NAME || (() => {
  try {
    const tail = uri.split('/').pop();
    return tail ? tail.split('?')[0] : 'profLocatorDB';
  } catch (e) {
    return 'profLocatorDB';
  }
})();

let db;
let usersCollection;

export const connectDB = async () => {
  try {
    await client.connect();
    console.log("✅ Successfully connected to MongoDB Atlas!");
    
    db = client.db(databaseName);
    usersCollection = db.collection("users");
    
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB", err);
    process.exit(1);
  }
};

// Export the client for graceful shutdown
export { client, usersCollection };