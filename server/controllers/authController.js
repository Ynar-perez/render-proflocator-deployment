// controllers/authController.js
import bcrypt from 'bcrypt';
import { usersCollection } from '../db/connect.js'; // Import the collection

// --- User Login ---
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usersCollection.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const sessionUser = { fullName: user.fullName, role: user.role, email: user.email };
      req.session.regenerate(err => {
        if (err) return res.status(500).json({ message: 'Session regeneration error.' });
        req.session.user = sessionUser;
        res.json({ message: 'Login successful', user: sessionUser });
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
};

// --- User Signup ---
export const signupUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (!email.endsWith('@ccc.edu.ph')) {
    return res.status(400).json({ message: 'Only CCC email addresses are allowed.' });
  }

  try {
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = {
      fullName,
      email,
      password: hashedPassword,
      role: 'STUDENT'
    };

    await usersCollection.insertOne(newUser);
    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
};

// --- Get Session ---
export const getSession = (req, res) => {
  if (req.session && req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};

// --- User Logout ---
export const logoutUser = (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) { throw err; }
      res.json({ message: 'Logout successful' });
    });
  } catch (error) {
    console.error('Error during logout:', error.message);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
};