const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Login/Register via Google OAuth
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Google token is required' });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user with a random strong password since they use Google to login
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10) + 'Aa1!';
      
      user = await User.create({
        name: name || 'Student',
        email,
        password: randomPassword,
        provider: 'google',
        profilePhoto: payload.picture || null
      });
    } else {
      if (user.status === 'disabled') {
        return res.status(403).json({ success: false, message: 'Your account has been disabled. Please contact an administrator.' });
      }
      
      // Update profile photo if it's missing or they signed in with Google
      if (payload.picture && user.profilePhoto !== payload.picture) {
        user.profilePhoto = payload.picture;
        await user.save();
      }
    }

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Google Auth Error:', error);
    return res.status(401).json({ success: false, message: 'Invalid Google token' });
  }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user
  });
};
