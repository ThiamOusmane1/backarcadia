require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});


const mailOptions = {
    from: 'thiamouss44@gmail.com',
    to: 'thiam.o81@outlook.com', // Mettre une vraie adresse 
    subject: 'Test Nodemailer ✔️',
    text: 'Ceci est un test d’envoi d’e-mail via Nodemailer et Gmail avec mot de passe d’application.'
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('❌ Erreur envoi :', error);
    }
    console.log('✅ Email envoyé avec succès :', info.response);
  });