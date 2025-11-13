// controllers/professorController.js
import { usersCollection } from '../db/connect.js'; // Import the collection

// --- Get All Professors ---
export const getAllProfessors = async (req, res) => {
  try {
    const professors = await usersCollection.find({ role: 'PROFESSOR' }).toArray();
    res.json(professors);
  } catch (error) {
    console.error('Error fetching professors:', error);
    res.status(500).json({ message: 'Failed to retrieve professor data.' });
  }
};

// --- Update Professor Details ---
export const updateProfessor = async (req, res) => {
  const { email } = req.params;
  const { status, consultationHours, location, classSchedules, statusUntil, locationLastModified } = req.body;

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
    
    const updatedProf = await usersCollection.findOne({ email: email, role: 'PROFESSOR' });
    res.json({ message: 'Profile updated successfully.', updated: updatedProf });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile.', error: error });
  }
};