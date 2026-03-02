import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['student', 'admin'],
      default: 'student',
    },
    borrowedBooks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to match entered password with hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Static method to seed an admin user
userSchema.statics.seedAdmin = async function () {
  try {
    const adminExists = await this.findOne({ role: 'admin' });
    if (!adminExists) {
      await this.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'adminpassword',
        role: 'admin',
      });
      console.log('Default admin user has been created.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
  }
};

const User = mongoose.model('User', userSchema);

export default User;