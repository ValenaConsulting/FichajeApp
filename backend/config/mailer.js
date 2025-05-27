const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fichaje.reset.pswd@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD, // Usa una contraseña de aplicación, no tu contraseña real
  },
});

module.exports = transporter;
