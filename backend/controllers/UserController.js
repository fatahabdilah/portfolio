const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// Fungsi helper untuk membuat token JWT
const createToken = (_id) => {
  // Kita butuh SECRET key di .env
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// --- Controller: Register ---
const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const user = await User.register(email, password, name);
    const token = createToken(user._id);

    res.status(201).json({
      email: user.email,
      name: user.name,
      token,
      message: "Registration successful", // Pesan Sukses Inggris
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// --- Controller: Login (Akan diisi nanti) ---
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);

    console.log(`[AUTH] User ${email} logged in successfully.`);

    res.status(200).json({
      email: user.email,
      name: user.name,
      token,
    });
  } catch (error) {
    console.error(`[AUTH ERROR] Login failed for ${email}: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message:
          "If a user with that email exists, a password reset link has been sent.",
      });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    res.status(200).json({
      message:
        "Reset token generated and saved (check your console/db for the token)",
      resetToken,
    });
  } catch (error) {
    console.error("Password reset request failed:", error.message);
    res.status(400).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw Error("Password reset token is invalid or has expired.");
    }

    if (!password) {
      throw Error("New password must be provided.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ 
      message: "Password has been successfully reset" 

    });
  }catch (error) {
    console.error('Password reset failed:', error.message);
    res.status(400).json({ error: error.message });
  }
};



module.exports = {
  // registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
