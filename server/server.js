// server.js

import './config.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';

import path from 'path';
import { fileURLToPath } from 'url';

// Now this import will work, because dotenv.config() has already run
import { connectDB, client } from './db/connect.js'; 
import authRoutes from './routes/authRoutes.js';     
import profRoutes from './routes/professorRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file

const app = express();
const port = process.env.PORT || 3000;

// --- Global Middleware ---
const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN || true,
  credentials: true
};

// Serve static files (HTML, CSS, JS) from the project root
app.use(express.static(path.join(__dirname, '..')));

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// Trust proxy
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
      collectionName: 'sessions'
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Rate limiter
const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use('/api/', limiter); // Apply to all API routes

// --- Routes ---
// Mount our routers
app.use('/api', authRoutes);     // All auth routes will be prefixed with /api
app.use('/api', profRoutes);     // All professor routes will be prefixed with /api

// Health check route
app.get('/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

// --- Start Server ---
const startServer = async () => {
  try {
    // 1. Connect to the database
    await connectDB();
    
    // 2. Start the Express server
    const server = app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });

    // --- Graceful Shutdown ---
    const gracefulShutdown = (signal) => {
      console.log(`Received ${signal}. Closing http server.`);
      server.close(async () => {
        console.log('Http server closed.');
        await client.close(); // Close DB client
        console.log('MongoDB client closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();