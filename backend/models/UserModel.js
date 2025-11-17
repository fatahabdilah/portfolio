// backend/models/UserModel.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

/**
 * @typedef User
 * @property {string} email - Unique email address for login.
 * @property {string} password - Hashed password for security.
 * @property {string} name - User's full name.
 * @property {string} role - User's access level ('user' or 'admin').
 */
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email is invalid"],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Defines allowed roles
      default: "user", // Default access level for security
      required: true,
    },
    // REMOVED: resetPasswordToken and resetPasswordExpires 
    // These fields are now handled by PasswordResetTokenModel
  },
  { 
    // Mongoose timestamps for tracking creation and updates
    timestamps: true 
  }
);


// -------------------------------------------------------------
// | Mongoose Static Methods (Business Logic)                  |
// -------------------------------------------------------------

/**
 * @desc Static method to create a new user (handles password hashing).
 * @param {string} email
 * @param {string} password
 * @param {string} name
 * @returns {Promise<User>} The newly created user document.
 */
userSchema.statics.register = async function (email, password, name) {
  if (!email || !password || !name) {
    throw Error("All fields must be filled");
  }

  // Check if email already exists
  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email is already in use");
  }

  // Hash the password for security
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user with hashed password
  const user = await this.create({ email, password: hashedPassword, name });

  return user;
};


/**
 * @desc Static method to authenticate a user during login (compares hashed password).
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>} The authenticated user document.
 */
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  // 1. Find user by email
  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Incorrect email or password"); // Security: Use generic error message
  }

  // 2. Compare input password with hashed password using bcrypt
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect email or password"); // Security: Use generic error message
  }

  // 3. Return user if credentials match
  return user;
};

module.exports = mongoose.model("User", userSchema);