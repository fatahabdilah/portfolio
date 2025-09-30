const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

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

module.exports = {
  // registerUser,
  loginUser,
};
