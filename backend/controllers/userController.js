import User from '../models/User.js';

export const createUser = async (req, res) => {
  try {
    const { name, lastName, username, email, role, status } = req.body;
    
    // Basic validation
    if (!name || !lastName || !username || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = new User({
      name,
      lastName,
      username,
      email,
      role: role || 'user',
      status: status || 'active',
      password: 'defaultPassword' // Temporary, we'll handle this later
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};