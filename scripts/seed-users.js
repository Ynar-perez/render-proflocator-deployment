import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new MongoClient(process.env.DATABASE_URL);
const saltRounds = 10; // Standard for bcrypt

async function seedUsers() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas for user seeding!");

    const database = client.db("profLocatorDB");
    const usersCollection = database.collection("users");

    // Clear existing users to prevent duplicates
    await usersCollection.deleteMany({});
    console.log("🗑️  Deleted existing users.");

    // --- Define Sample Users ---

    // Professor User (matches a professor in the 'professors' collection)
    const profPassword = await bcrypt.hash('password123', saltRounds);
    const professorUser = {
      email: 'jgarcia@ccc.edu.ph',
      password: profPassword,
      fullName: 'Jasper Garcia',
      role: 'PROFESSOR'
    };

    // Student User
    const studentPassword = await bcrypt.hash('studentpass', saltRounds);
    const studentUser = {
      email: 'npfeliciano@ccc.edu.ph',
      password: studentPassword,
      fullName: 'Charlie Feliciano',
      role: 'STUDENT'
    };

    // Insert users into the database
    const result = await usersCollection.insertMany([professorUser, studentUser]);
    console.log(`🌱 Seeded ${result.insertedCount} users successfully.`);

  } catch (err) {
    console.error("❌ Error seeding users:", err);
  } finally {
    await client.close();
    console.log("🚪 Connection closed.");
  }
}

seedUsers();