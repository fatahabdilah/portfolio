const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Fungsi helper untuk membuat token JWT
const createToken = (_id) => {
  // Kita butuh SECRET key di .env
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const sendEmail = async (email, subject, text, html) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE_HOST,
    port: process.env.EMAIL_SERVICE_PORT,
    secure: false, // true jika port 465, false jika port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, // Alamat pengirim
    to: email, // Alamat penerima (user yang lupa password)
    subject: subject,
    text: text,
    html: html,
  };

  await transporter.sendMail(mailOptions);
  console.log('[EMAIL] Reset password email sent to ${email}');
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

    const resetURL = `http://localhost:5000/reset-password/${resetToken}`;

    const subject = "Password Reset Link for My-Portfolio";
    const text = `You requested a password reset. Please use the following link to reset your password: ${resetURL}`;
    const html = `<div style="font-family: 'Poppins', Arial, sans-serif; padding: 25px; border-radius: 12px; max-width: 600px; margin: auto; background-color: #f9f9f9; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    <h2 style="color: #222; border-left: 5px solid #2196F3; padding-left: 10px; font-size: 22px;">
                      Permintaan Reset Password
                    </h2>
                    
                    <p style="font-size: 16px; color: #333;">
                      Halo <strong>${user.name}</strong>,
                    </p>
                    
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">
                      Kami menerima permintaan untuk mereset password akun Anda (<strong>${user.email}</strong>).  
                      Jika Anda tidak membuat permintaan ini, tidak perlu khawatir — tidak akan ada perubahan pada akun Anda.
                    </p>
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="${resetURL}" 
                          style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #fff; background: linear-gradient(135deg, #2196F3, #21CBF3); border-radius: 8px; text-decoration: none; font-weight: 600; transition: background 0.3s;">
                            Reset Password Saya
                        </a>
                    </div>

                    <p style="font-size: 14px; color: #777;">
                        Tautan ini hanya berlaku selama <strong>1 jam</strong>.  
                        Jika tombol di atas tidak berfungsi, salin dan tempel tautan berikut ke browser Anda:
                    </p>
                    <p style="font-size: 14px; color: #2196F3; word-break: break-all;">
                        ${resetURL}
                    </p>

                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">

                    <p style="font-size: 14px; color: #999;">
                        Terima kasih, <br>
                        <strong>Tim My-Portfolio</strong>
                    </p>
                  </div>`;

    await sendEmail(user.email, subject, text, html);

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
      message: "Password has been successfully reset",
    });
  } catch (error) {
    console.error("Password reset failed:", error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  // registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
