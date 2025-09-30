require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");

const ADMIN_EMAIL = "fatahabdilahh@gmail.com";
const ADMIN_PASSWORD = "akudisinikaudisana";
const ADMIN_NAME = "Fatah Abdilah";

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected. Starting seed...");

    await User.deleteMany({});
    console.log("Exiting users cleared");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    await User.create({
      email: ADMIN_EMAIL,
      password: hashedPassword,
      name: ADMIN_NAME,
      role: "admin",
    });

    console.log(`✅ Admin user created: ${ADMIN_EMAIL} with role: admin`);
  } catch (error) {
    console.log("❌ SEEDING FAILED:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

seedDB();
