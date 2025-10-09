const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Fungsi helper untuk membuat token JWT utama (untuk login sesi)
const createToken = (_id) => {
  // Kita butuh SECRET key di .env
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// Fungsi helper untuk mengirim email (sudah diperbaiki logging)
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
  console.log(`[EMAIL] Reset password email sent to ${email}`); // <-- Diperbaiki ke template literal
};

// --- Controller: Register (Dikomentari karena menggunakan Seeder) ---
/*
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
*/

// --- Controller: Login ---
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

// --- Controller: Forgot Password ---
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        // Status 200 untuk mencegah enumerasi email
        message:
          "If a user with that email exists, a password reset link has been sent.",
      });
    }
    // Bagian yang menggunakan JWT (Profesional & Aman)
    // ----------------------------------------------------------------------------------
    // 1. Buat token reset SEBAGAI JWT (Ditandatangani dengan RESET_SECRET)
    const resetTokenJWT = jwt.sign(
      { _id: user._id },
      process.env.RESET_SECRET,
      { expiresIn: "1h" }
    );

    // 2. Hash token JWT untuk disimpan di DB (Untuk keamanan tambahan)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetTokenJWT)
      .digest("hex");

    // 3. Simpan token yang di-hash di DB dan waktu kedaluwarsa
    user.resetPasswordToken = hashedToken;
    // user.resetPasswordExpires TIDAK diperlukan jika menggunakan JWT expiresIn,
    // tapi kita simpan untuk memudahkan query
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    // resetToken adalah JWT mentah yang dikirim ke email
    const finalTokenToSend = resetTokenJWT;
    // ----------------------------------------------------------------------------------

    /* // Bagian yang HANYA menggunakan Crypto Random String (Metode Dasar)
    // ----------------------------------------------------------------------------------
    const resetTokenCrypto = crypto.randomBytes(20).toString("hex");
    
    // Simpan string acak langsung ke DB
    user.resetPasswordToken = resetTokenCrypto;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
    const finalTokenToSend = resetTokenCrypto; // Kirim string acak ke email
    // ----------------------------------------------------------------------------------
    */

    await user.save(); // Ganti URL ini dengan URL frontend kamu

    const resetURL = `http://localhost:5173/reset-password/${finalTokenToSend}`;

    const subject = "Password Reset Link for My-Portfolio";
    const text = `You requested a password reset. Please use the following link to reset your password: ${resetURL}`;
    const html = `
     <div style="font-family: 'Poppins', Arial, sans-serif; 
                padding: 15px; /* Padding lebih kecil untuk HP */
                border-radius: 12px; 
                /* LEBAR UTAMA: Max 600px, tetapi fleksibel */
                max-width: 600px; 
                width: 90%; /* Selalu ambil 90% lebar viewport */
                margin: 20px auto; /* Margin atas/bawah yang lebih aman */
                background-color: #ffffff; /* Ubah ke putih bersih */
                border: 1px solid #e0e0e0;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                box-sizing: border-box;">

        <h2 style="color: #222; 
                   border-left: 5px solid #2196F3; 
                   padding-left: 10px; 
                   font-size: 20px; /* Ukuran font sedikit lebih kecil */
                   margin-bottom: 20px;
                   line-height: 1.2;">
            Permintaan Reset Password
        </h2>
        
        <p style="font-size: 15px; color: #333; margin-top: 0;">
            Halo <strong>${user.name}</strong>,
        </p>
        
        <p style="font-size: 15px; color: #555; line-height: 1.6;">
            Kami menerima permintaan untuk mereset password akun Anda (<strong>${user.email}</strong>). 
            Jika Anda tidak membuat permintaan ini, abaikan email ini.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetURL}" 
               style="display: inline-block; 
                      padding: 15px 30px; /* Padding lebih besar untuk tombol */
                      font-size: 17px; /* Ukuran font lebih besar untuk tombol */
                      color: #fff; 
                      background: linear-gradient(135deg, #2196F3, #21CBF3); 
                      border-radius: 8px; 
                      text-decoration: none; 
                      font-weight: 700; 
                      transition: background 0.3s;
                      white-space: nowrap;"> Reset Password Saya
            </a>
        </div>

        <p style="font-size: 13px; color: #777; line-height: 1.4;">
            Tautan ini hanya berlaku selama <strong>1 jam</strong>.  
            Jika tombol di atas tidak berfungsi, salin dan tempel tautan berikut ke browser Anda:
        </p>
        <p style="font-size: 13px; color: #2196F3; word-break: break-all;">
            ${resetURL}
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">

        <p style="font-size: 13px; color: #999;">
            Terima kasih, <br>
            <strong>Tim My-Portfolio</strong>
        </p>
    </div>
    `;

    await sendEmail(user.email, subject, text, html);

    res.status(200).json({
      message:
        "Reset token generated and saved (check your console/db for the token)",
      resetToken: finalTokenToSend, // <-- Kirim token yang digunakan
    });
  } catch (error) {
    console.error("Password reset request failed:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// --- Controller: Reset Password ---
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  // Bagian yang menggunakan JWT (Profesional & Aman)
  // ----------------------------------------------------------------------------------
  // 1. Hash token dari URL (URL token) untuk dibandingkan dengan hash di DB
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // 2. Cari user berdasarkan HASHED TOKEN dan waktu kedaluwarsa
  // Kita tetap memeriksa waktu kedaluwarsa di DB meskipun JWT sudah punya waktu kedaluwarsa bawaan.
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
  // ----------------------------------------------------------------------------------

  /*
    // Bagian yang HANYA menggunakan Crypto Random String (Metode Dasar)
    // ----------------------------------------------------------------------------------
    // const user = await User.findOne({ 
    //   resetPasswordToken: token, // Mencari string acak mentah di DB
    //   resetPasswordExpires: { $gt: Date.now() } 
    // });
    // ----------------------------------------------------------------------------------
    */

  try {
    // Jika user tidak ditemukan, throw error
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
