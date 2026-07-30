const nodemailer = require('nodemailer');

// Create a transporter
// By default, if credentials are missing, we log emails to console (for development)
let transporter;

const setupTransporter = async () => {
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // Generate a test ethereal account if no credentials are provided (Dev fallback)
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log('Using Ethereal Email for testing (No SMTP credentials found in .env)');
    } catch (error) {
      console.error('Failed to create ethereal account:', error);
    }
  }
};

setupTransporter();

const sendEmail = async (options) => {
  if (!transporter) {
    console.warn('Transporter not initialized. Email not sent:', options);
    return;
  }

  const mailOptions = {
    from: `"StudentOS AI" <${process.env.EMAIL_FROM || 'noreply@studentos.ai'}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    if (info.messageId && info.messageId.includes('ethereal')) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

module.exports = sendEmail;
