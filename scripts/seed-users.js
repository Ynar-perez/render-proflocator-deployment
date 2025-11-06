import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Prevent running in production
if (process.env.NODE_ENV === 'production') {
  console.error('CRITICAL: DO NOT RUN THE SEED SCRIPT IN PRODUCTION. Aborting.');
  process.exit(1);
}

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

    // --- Define Sample Users ---

    const profPassword = await bcrypt.hash('jasper123', saltRounds);
    const professorUser = {
      email: 'jgarcia@ccc.edu.ph',
      password: profPassword,
      fullName: 'Jasper Garcia',
      role: 'PROFESSOR',
      // --- Merged professor data ---
      department: 'Computer and Informatics',
      status: 'Not Set',
      statusUntil: null,
      location: null,
      locationLastModified: null, // Added for tracking location changes
      pImg: '/media/professors/jaspergarcia.jpg',
      consultationHours: [
        { day: 'Monday', from: '8:00 AM', to: '11:00 AM' },
        { day: 'Tuesday', from: '8:00 AM', to: '11:00 AM' },
        { day: 'Wednesday', from: '1:00 PM', to: '3:00 PM' },
        { day: 'Thursday', from: '1:00 PM', to: '3:00 PM' }
      ],
      classSchedules: [
        { day: 'Monday', from: '07:00', to: '09:00', subject: 'NET 201', section: '2-IT9', roomType: 'R-404' },
        { day: 'Tuesday', from: '13:00', to: '15:00', subject: 'CS 101', section: '1-CS1', roomType: 'Online' },
        { day: 'Wednesday', from: '09:00', to: '12:00', subject: 'PROG 301', section: '3-IT2', roomType: '1 JMC-CL2' }
      ],
    };

    const profPassword2 = await bcrypt.hash('jocelyn123', saltRounds);
    const professorUser2 = {
      email: 'jgllanderal@ccc.edu.ph',
      password: profPassword2,
      fullName: 'Jocelyn Llanderal, MIT',
      role: 'PROFESSOR',
      // --- Merged professor data ---
      department: 'Computer and Informatics',
      status: 'Not Set',
      statusUntil: null,
      location: null,
      locationLastModified: null, // Added for tracking location changes
      pImg: '/media/professors/jocelynllanderal.jpg',
      consultationHours: [
        { day: 'Monday', from: '1:00 PM', to: '4:00 PM' },
        { day: 'Tuesday', from: '9:00 AM', to: '11:00 AM' },
        { day: 'Wednesday', from: '8:00 AM', to: '11:00 AM' },
        { day: 'Friday', from: '9:00 AM', to: '11:00 AM' }
      ],
      classSchedules: [],
    };

    // --- Adding the rest of the professors ---

    const profPassword3 = await bcrypt.hash('junico123', saltRounds);
    const professorUser3 = {
      email: 'jyuneza@ccc.edu.ph',
      password: profPassword3,
      fullName: 'Junico Yuneza',
      role: 'PROFESSOR',
      department: 'Computer and Informatics',
      status: 'Not Set',
      statusUntil: null,
      location: null,
      locationLastModified: null, // Added for tracking location changes
      pImg: '/media/professors/junicoyuneza.jpg',
      consultationHours: [
        { day: 'Monday', from: '8:00 AM', to: '12:00 PM' },
        { day: 'Wednesday', from: '9:00 AM', to: '11:00 AM' },
        { day: 'Thursday', from: '1:00 PM', to: '5:00 PM' }
      ],
      classSchedules: [],
    };

    const profPassword4 = await bcrypt.hash('laurice123', saltRounds);
    const professorUser4 = {
      email: 'lmariquina@ccc.edu.ph',
      password: profPassword4,
      fullName: 'Laurice Mariquina',
      role: 'PROFESSOR',
      department: 'Computer and Informatics',
      status: 'Not Set',
      statusUntil: null,
      location: null,
      locationLastModified: null, // Added for tracking location changes
      pImg: '/media/professors/placeholder.jpg',
      consultationHours: [
        { day: 'Wednesday', from: '9:00 AM', to: '12:00 PM' },
        { day: 'Friday', from: '8:00 AM', to: '12:00 PM' },
        { day: 'Saturday', from: '2:00 PM', to: '5:00 PM' }
      ],
      classSchedules: [],
    };

    const profPassword5 = await bcrypt.hash('mark123', saltRounds);
    const professorUser5 = {
      email: 'mabuyo@ccc.edu.ph',
      password: profPassword5,
      fullName: 'Mark Anthony Abuyo',
      role: 'PROFESSOR',
      department: 'Computer and Informatics',
      status: 'Not Set',
      statusUntil: null,
      location: null,
      locationLastModified: null, // Added for tracking location changes
      pImg: '/media/professors/placeholder.jpg',
      consultationHours: [
        { day: 'Monday', from: '1:00 PM', to: '4:00 PM' },
        { day: 'Wednesday', from: '8:00 AM', to: '10:00 AM' },
        { day: 'Friday', from: '1:00 PM', to: '3:00 PM' },
        { day: 'Saturday', from: '8:00 AM', to: '12:00 PM' }
      ],
      classSchedules: [],
    };

    const profPassword6 = await bcrypt.hash('nimfa123', saltRounds);
    const professorUser6 = {
      email: 'nracelis@ccc.edu.ph',
      password: profPassword6,
      fullName: 'Nimfa Racelis',
      role: 'PROFESSOR',
      department: 'Computer and Informatics',
      status: 'Not Set',
      statusUntil: null,
      location: null,
      locationLastModified: null, // Added for tracking location changes
      pImg: '/media/professors/placeholder.jpg',
      consultationHours: [
        { day: 'Monday', from: '9:00 AM', to: '11:00 AM' },
        { day: 'Tuesday', from: '9:00 AM', to: '12:00 PM' },
        { day: 'Wednesday', from: '9:00 AM', to: '11:00 AM' },
        { day: 'Thursday', from: '1:00 PM', to: '3:00 PM' },
        { day: 'Friday', from: '1:00 PM', to: '4:00 PM' }
      ],
      classSchedules: [],
    };

    // Student User
    const studentPassword = await bcrypt.hash('tani123', saltRounds);
    const studentUser = {
      email: 'npfeliciano@ccc.edu.ph',
      password: studentPassword,
      fullName: 'Nathaniel Feliciano',
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