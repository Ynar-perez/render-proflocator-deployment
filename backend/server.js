import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

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

    // API Endpoint to get all professors
    app.get('/api/professors', async (req, res) => {
      const professors = await professorsCollection.find({}).toArray();
      res.json(professors);
    });

    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });

  } catch (err) {
    console.error("❌ Failed to connect to MongoDB", err);
  }
}

run();
