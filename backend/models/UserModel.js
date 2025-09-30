const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

// --- User Schema Definition ---
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Email is invalid"], // Pesan Error Inggris
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'], // Hanya boleh 'user' atau 'admin'
      default: 'user', // Default untuk keamanan
      required: true,
    }
  },
  { timestamps: true }
);

// --- Static Method: Register ---
userSchema.statics.register = async function (email, password, name) {
  if (!email || !password || !name) {
    throw Error("All fields must be filled"); // Pesan Error Inggris
  }

  // Validasi email secara eksternal jika perlu, tapi sudah ada di schema

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email is already in use"); // Pesan Error Inggris
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hashedPassword, name });

  return user;
};

// --- Static Method: Login (Akan digunakan nanti) ---
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Incorrect email or password");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect email or password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
