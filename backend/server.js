import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import cron from 'node-cron';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Use environment port in production

// Middleware
// Configure CORS: allow explicit ALLOWED_ORIGIN in production, otherwise reflect origin
const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN || true,
  credentials: true
};
app.use(cors(corsOptions)); // Allows requests from our frontend; credentials needed for cookies
app.use(express.json()); // Allows the server to understand JSON
app.use(cookieParser());

// Security middlewares
app.use(helmet());
// Basic rate limiter for API endpoints
const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 }); // 120 requests per minute per IP
app.use('/api/', limiter);

// Trust proxy when running behind a reverse proxy (required for secure cookies)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(
  session({
    secret: process.env.SESSION_SECRET, // This MUST be set in your .env file
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
      collectionName: 'sessions'
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // requires HTTPS in production
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

// Serve static frontend files from project root (when deploying single host)
const staticDir = process.env.STATIC_DIR || process.cwd();
app.use(express.static(staticDir));

const uri = process.env.DATABASE_URL;
if (!uri) {
  console.error("DATABASE_URL not found in .env file");
  process.exit(1);
}

const client = new MongoClient(uri);

// Derive database name: prefer explicit env var DATABASE_NAME, otherwise parse from URI
const databaseName = process.env.DATABASE_NAME || (() => {
  try {
    const tail = uri.split('/').pop();
    return tail ? tail.split('?')[0] : 'profLocatorDB';
  } catch (e) {
    return 'profLocatorDB';
  }
})();

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("✅ Successfully connected to MongoDB Atlas!");

  const database = client.db(databaseName);
    const usersCollection = database.collection("users");

  // Health check
  app.get('/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'development' }));

    // Scheduled jobs are run in a separate worker process (backend/worker.js)

    // API Endpoint to get all professors
    app.get('/api/professors', async (req, res) => {
      try {
        // Find all documents in the 'users' collection with the role 'PROFESSOR'
        const professors = await usersCollection.find({ role: 'PROFESSOR' }).toArray();
        res.json(professors);
      } catch (error) {
        console.error('Error fetching professors:', error);
        res.status(500).json({ message: 'Failed to retrieve professor data.' });
      }
    });

    // API Endpoint for user login
    app.post('/api/login', async (req, res) => {
      try {
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
          // Passwords match - login successful, create a session
          const sessionUser = { fullName: user.fullName, role: user.role, email: user.email };
          // Regenerate session to prevent session fixation
          req.session.regenerate(err => {
            if (err) return res.status(500).json({ message: 'An internal server error occurred during session regeneration.' });
            req.session.user = sessionUser;
            res.json({ message: 'Login successful', user: sessionUser });
          });
        } else {
          // Passwords do not match
          res.status(401).json({ message: 'Invalid credentials' });
        }
      } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'An internal server error occurred.' });
      }
    });

    // API Endpoint to get current session user
    app.get('/api/session', (req, res) => {
      if (req.session && req.session.user) {
        res.json({ user: req.session.user });
      } else {
        res.status(401).json({ message: 'Not authenticated' });
      }
    });

    // API Endpoint for user logout
    app.post('/api/logout', (req, res) => {
      try {
        req.session.destroy(err => { if (err) { throw err; } res.json({ message: 'Logout successful' }); });
      } catch (error) {
        console.error('Error during logout:', error.message);
        res.status(500).json({ message: 'An internal server error occurred.' });
      }
    });

    // API Endpoint for user sign-up
    app.post('/api/signup', async (req, res) => {
      const { fullName, email, password } = req.body;

      // Basic validation
      if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      // Validate email domain
      if (!email.endsWith('@ccc.edu.ph')) {
        return res.status(400).json({ message: 'Only CCC email addresses (@ccc.edu.ph) are allowed.' });
      }

      try {
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
      } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'An internal server error occurred.' });
      }
    });

    // API Endpoint to update a professor's details (status, consultation hours, class schedules, location, etc.)
    app.put('/api/professors/:email', async (req, res) => {
      const { email } = req.params;
      const { status, consultationHours, location, classSchedules, statusUntil, locationLastModified } = req.body; // Add locationLastModified

      // Ensure there's something to update
      if (status === undefined && consultationHours === undefined && location === undefined && classSchedules === undefined && statusUntil === undefined) {
        return res.status(400).json({ message: 'No update data provided.' });
      }

      try {
        const updatePayload = {};
        if (status !== undefined) updatePayload.status = status;
        if (statusUntil !== undefined) updatePayload.statusUntil = statusUntil;
        if (consultationHours !== undefined) updatePayload.consultationHours = consultationHours;
        if (location !== undefined) {
          updatePayload.location = location;
          // Use provided timestamp if included, otherwise generate server-side ISO timestamp
          updatePayload.locationLastModified = locationLastModified || new Date().toISOString();
        }
        if (classSchedules !== undefined) updatePayload.classSchedules = classSchedules;

        const result = await usersCollection.updateOne(
          { email: email, role: 'PROFESSOR' },
          { $set: updatePayload }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'Professor not found.' });
        }

        // Return the updated professor document so frontend can immediately reflect timestamps
        const updatedProf = await usersCollection.findOne({ email: email, role: 'PROFESSOR' });
        res.json({ message: 'Profile updated successfully.', updated: updatedProf });
      } catch (error) {
        res.status(500).json({ message: 'Error updating profile.', error: error });
      }
    });

    // Consolidated status update job moved to a separate worker process (backend/worker.js)

    // Start the Express server
    const server = app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });

    // --- Graceful Shutdown ---
    const gracefulShutdown = (signal) => {
      console.log(`Received ${signal}. Closing http server.`);
      server.close(async () => {
        console.log('Http server closed.');
        await client.close();
        console.log('MongoDB client closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (err) {
    console.error("❌ Failed to connect to MongoDB", err);
    process.exit(1); // Exit if DB connection fails on startup
  }
}

run();
