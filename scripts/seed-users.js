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

    // Comment out or remove this line to make the script non-destructive
    // await usersCollection.deleteMany({});
    // console.log("🗑️  Deleted existing users.");

    // --- Define Sample Users ---

    // --- Professor Users (now with profile data included) ---
    const profPassword = await bcrypt.hash('password123', saltRounds);
    const professorUser = {
      email: 'jgarcia@ccc.edu.ph',
      password: profPassword,
      fullName: 'Jasper Garcia',
      role: 'PROFESSOR',
      // --- Merged professor data ---
      department: 'Computer and Informatics',
      status: 'Available',
      pImg: '/media/professors/jaspergarcia.jpg',
      officeHours: [
        { day: 'Monday', from: '8:00 AM', to: '11:00 AM' },
        { day: 'Tuesday', from: '8:00 AM', to: '10:00 AM' },
        { day: 'Wednesday', from: '1:00 PM', to: '3:00 PM' }
      ]
    };

    const profPassword2 = await bcrypt.hash('anotherPassword456', saltRounds);
    const professorUser2 = {
      email: 'jgllanderal@ccc.edu.ph',
      password: profPassword2,
      fullName: 'Jocelyn Llanderal, MIT',
      role: 'PROFESSOR',
      // --- Merged professor data ---
      department: 'Computer and Informatics',
      status: 'In a Meeting',
      pImg: '/media/professors/jocelynllanderal.jpg',
      officeHours: [
        { day: 'Tuesday', from: '9:00 AM', to: '11:00 AM' },
        { day: 'Wednesday', from: '8:00 AM', to: '11:00 AM' }
      ]
    };

    // --- Adding the rest of the professors ---

    const profPassword3 = await bcrypt.hash('password_yuneza', saltRounds);
    const professorUser3 = {
      email: 'jyuneza@ccc.edu.ph',
      password: profPassword3,
      fullName: 'Junico Yuneza',
      role: 'PROFESSOR',
      department: 'Computer and Informatics',
      status: 'Not Set',
      pImg: '/media/professors/junicoyuneza.jpg',
      officeHours: [
        { day: 'Wednesday', from: '9:00 AM', to: '11:00 AM' },
        { day: 'Thursday', from: '1:00 PM', to: '3:00 PM' }
      ]
    };

    const profPassword4 = await bcrypt.hash('password_mariquina', saltRounds);
    const professorUser4 = {
      email: 'lmariquina@ccc.edu.ph',
      password: profPassword4,
      fullName: 'Laurice Mariquina',
      role: 'PROFESSOR',
      department: 'Computer and Informatics',
      status: 'In Class',
      pImg: '/media/professors/placeholder.jpg',
      officeHours: [
        { day: 'Wednesday', from: '9:00 AM', to: '1:00 PM' },
        { day: 'Friday', from: '8:00 AM', to: '10:00 AM' },
        { day: 'Saturday', from: '2:00 PM', to: '5:00 PM' }
      ]
    };

    const profPassword5 = await bcrypt.hash('password_abuyo', saltRounds);
    const professorUser5 = {
      email: 'mabuyo@ccc.edu.ph',
      password: profPassword5,
      fullName: 'Mark Anthony Abuyo',
      role: 'PROFESSOR',
      department: 'Computer and Informatics',
      status: 'Away',
      pImg: '/media/professors/placeholder.jpg',
      officeHours: [
        { day: 'Monday', from: '1:00 PM', to: '3:00 PM' },
        { day: 'Wednesday', from: '8:00 AM', to: '10:00 AM' },
        { day: 'Saturday', from: '8:00 AM', to: '12:00 PM' }
      ]
    };

    const profPassword6 = await bcrypt.hash('password_racelis', saltRounds);
    const professorUser6 = {
      email: 'nracelis@ccc.edu.ph',
      password: profPassword6,
      fullName: 'Nimfa Racelis',
      role: 'PROFESSOR',
      department: 'Computer and Informatics',
      status: 'Busy',
      pImg: '/media/professors/placeholder.jpg',
      officeHours: [
        { day: 'Monday', from: '9:00 AM', to: '11:00 AM' },
        { day: 'Tuesday', from: '9:00 AM', to: '11:00 AM' },
        { day: 'Thursday', from: '1:00 PM', to: '3:00 PM' },
        { day: 'Friday', from: '1:00 PM', to: '3:00 PM' }
      ]
    };

    // Student User
    const studentPassword = await bcrypt.hash('studentpass', saltRounds);
    const studentUser = {
      email: 'npfeliciano@ccc.edu.ph',
      password: studentPassword,
      fullName: 'Charlie Feliciano',
      role: 'STUDENT'
    };

    // Use "upsert" to add/update users without deleting others
    // This will update the user if the email exists, or insert a new one if it doesn't.
    const operations = [
      {
        updateOne: {
          filter: { email: professorUser.email },
          update: { $set: professorUser },
          upsert: true
        }
      },
      // You can add more users here in the same format
      {
        updateOne: {
          filter: { email: professorUser2.email },
          update: { $set: professorUser2 },
          upsert: true
        }
      },
      {
        updateOne: {
          filter: { email: professorUser3.email },
          update: { $set: professorUser3 },
          upsert: true
        }
      },
      {
        updateOne: {
          filter: { email: professorUser4.email },
          update: { $set: professorUser4 },
          upsert: true
        }
      },
      {
        updateOne: {
          filter: { email: professorUser5.email },
          update: { $set: professorUser5 },
          upsert: true
        }
      },
      {
        updateOne: {
          filter: { email: professorUser6.email },
          update: { $set: professorUser6 },
          upsert: true
        }
      },
      {
        updateOne: {
          filter: { email: studentUser.email },
          update: { $set: studentUser },
          upsert: true
        }
      }
    ];

    // The result will tell you how many were inserted (upserted) or modified.
    const result = await usersCollection.bulkWrite(operations);
    console.log(`🌱 User seeding complete. Inserted: ${result.upsertedCount}, Modified: ${result.modifiedCount}`);

  } catch (err) {
    console.error("❌ Error seeding users:", err);
  } finally {
    await client.close();
    console.log("🚪 Connection closed.");
  }
}

seedUsers();