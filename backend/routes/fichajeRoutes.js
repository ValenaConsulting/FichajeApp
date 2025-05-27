import express from 'express';
import { createFichaje, getTodayFichajes } from '../controllers/fichajeController.js';

const router = express.Router();
router.post('/', createFichaje);
router.get('/today', getTodayFichajes);

export default router;