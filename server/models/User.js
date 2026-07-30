const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Do not return password by default
    },
    college: {
      type: String,
      default: ''
    },
    branch: {
      type: String,
      default: ''
    },
    semester: {
      type: Number,
      default: 1
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
      default: 'student'
    },
    provider: {
      type: String,
      enum: ['email', 'google'],
      default: 'email'
    },
    profilePhoto: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['active', 'disabled'],
      default: 'active'
    },
    skills: {
      type: [String],
      default: []
    },
    interests: {
      type: [String],
      default: []
    },
    // --- Phase 12: Academic Profile Fields ---
    rollNumber: { type: String, default: '' },
    regNumber: { type: String, default: '' },
    department: { type: String, default: '' },
    section: { type: String, default: '' },
    academicYear: { type: String, default: '' },
    batch: { type: String, default: '' },
    admissionDate: { type: Date, default: null },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  {
    timestamps: true
  }
);

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function () {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
