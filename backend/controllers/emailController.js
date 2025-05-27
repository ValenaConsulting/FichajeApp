import sendEmail from '../utils/sendEmail.js';

export const sendTestEmail = async (req, res) => {
  try {
    const { email } = req.body;
    await sendEmail(
      email || 'fichajevalena@yopmail.com',
      'Prueba',
      'Prueba de email'
    );
    res.status(200).json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ message: 'Failed to send test email' });
  }
};