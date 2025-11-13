// routes/professorRoutes.js
import { Router } from 'express';
import { getAllProfessors, updateProfessor } from '../controllers/professorController.js';

const router = Router();

router.get('/professors', getAllProfessors);
router.put('/professors/:email', updateProfessor);

export default router;