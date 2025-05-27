import express from 'express';
import User from '../models/User.js';
import { requestPasswordReset } from '../controllers/authController.js';
import { resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Set session
    req.session.userId = user._id;
    req.session.save(err => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ message: 'Session error' });
      }
      
      res.status(200).json({ 
        message: 'Login successful',
        redirect: '/fichaje'
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ redirect: '/login' });
  });
});


router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

router.get('/check-session', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(200).json({ redirect: '/login' });
    }
    res.status(200).json({ message: 'Session valid' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ 
      name: user.name,
      role: user.role  // Add this line
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;