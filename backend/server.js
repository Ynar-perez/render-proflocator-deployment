import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000; // The port our server will run on

// Middleware
app.use(cors()); // Allows requests from our frontend
app.use(express.json()); // Allows the server to understand JSON

const uri = process.env.DATABASE_URL;
if (!uri) {
  console.error("DATABASE_URL not found in .env file");
  process.exit(1);
}

const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("✅ Successfully connected to MongoDB Atlas!");

    const database = client.db("profLocatorDB");
    const professorsCollection = database.collection("professors");
    const usersCollection = database.collection("users");

    // API Endpoint to get all professors
    app.get('/api/professors', async (req, res) => {
      const professors = await professorsCollection.find({}).toArray();
      res.json(professors);
    });

    // API Endpoint for user login
    app.post('/api/login', async (req, res) => {
      const { email, password } = req.body;

      // Find the user by email
      const user = await usersCollection.findOne({ email: email });

      if (!user) {
        // User not found
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        // Passwords match - login successful
        res.json({ message: 'Login successful', user: { fullName: user.fullName, role: user.role, email: user.email } });
      } else {
        // Passwords do not match
        res.status(401).json({ message: 'Invalid credentials' });
      }
    });

    // API Endpoint for user sign-up
    app.post('/api/signup', async (req, res) => {
      const { fullName, email, password } = req.body;

      // Basic validation
      if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      // Check if user already exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'An account with this email already exists.' }); // 409 Conflict
      }

      // Hash the password before storing it
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create the new user object (all sign-ups are students by default)
      const newUser = {
        fullName,
        email,
        password: hashedPassword,
        role: 'STUDENT'
      };

      // Insert the new user into the database
      await usersCollection.insertOne(newUser);
      res.status(201).json({ message: 'User created successfully!' });
    });

    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });

  } catch (err) {
    console.error("❌ Failed to connect to MongoDB", err);
  }
}

run();
