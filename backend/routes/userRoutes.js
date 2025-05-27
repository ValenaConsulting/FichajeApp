import express from 'express';
import User from '../models/User.js'; // Add this import
import { getUsers, createUser, deleteUser, updateUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.delete('/:id', deleteUser);
router.put('/:id', updateUser);

export default router;