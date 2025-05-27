export const sessionCheck = (req, res, next) => {
  // Skip session check for password reset routes
  if (req.path.includes('/reset-password')) {
    return next();
  }
  
  if (!req.session.userId) {
    return res.status(401).json({ redirect: '/login' });
  }
  next();
};