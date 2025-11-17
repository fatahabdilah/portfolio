const User = require("../models/UserModel");
const PasswordResetToken = require("../models/PasswordResetTokenModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// --- Helper Functions ---

/**
 * @desc Creates a primary session JWT (JSON Web Token) for authentication.
 * @param {ObjectId} _id - The Mongoose ID of the user.
 * @returns {string} The signed JWT string.
 */
const createToken = (_id) => {
  // Uses the SECRET key from .env
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

/**
 * @desc Sends an email using Nodemailer configuration from environment variables.
 */
const sendEmail = async (email, subject, text, html) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE_HOST,
    port: process.env.EMAIL_SERVICE_PORT,
    secure: false, // Set to true if using port 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: text,
    html: html,
  };

  await transporter.sendMail(mailOptions);
  console.log(`[EMAIL] Reset password email sent to ${email}`);
};


// ---------------------------------------------------------------------
// | 1. USER AUTHENTICATION & SESSION CONTROL                          |
// ---------------------------------------------------------------------

/**
 * @desc User Login Controller. Validates credentials and issues a JWT.
 * @route POST /api/users/login
 * @access Public
 */
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


/**
 * @desc Fetches the authenticated user's ID. 
 * This is primarily for testing the JWT authentication flow.
 * @route GET /api/users/profile
 * @access Private
 */
const getProfile = async (req, res) => {
    // req.user is populated by the requireAuth middleware
    res.status(200).json({
        message: "Secret access granted! Profile data retrieved.",
        userId: req.user._id,
    });
};


// ---------------------------------------------------------------------
// | 2. PASSWORD RESET FLOW: FORGOT PASSWORD                           |
// ---------------------------------------------------------------------

// REMOVED: USE_JWT_RESET toggle. Only using Crypto Random String method.


/**
 * @desc Initiates the password reset flow: generates a token and sends an email.
 * @route POST /api/users/forgotpassword
 * @access Public
 */
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // Security measure: Respond 200 OK even if user not found to prevent email enumeration
      return res.status(200).json({
        message: "If a user with that email exists, a password reset link has been sent.",
      });
    }

    // --- Token Generation (Crypto Random String Method Only) ---
    // The raw token sent to the user is also the token hashed/stored in the DB (for simplicity)
    const finalTokenToSend = crypto.randomBytes(20).toString("hex");
    const tokenToStoreInDB = finalTokenToSend; 
    
    const expirationTime = 3600000; // 1 hour in milliseconds

    // 1. DELETE any existing token for this user to prevent clutter
    await PasswordResetToken.deleteMany({ userId: user._id });

    // 2. CREATE the new token document
    const expiresAt = new Date(Date.now() + expirationTime);
    await PasswordResetToken.create({
        userId: user._id,
        token: tokenToStoreInDB,
        expiresAt: expiresAt,
    });
    
    // --- Email Content Preparation ---
    const frontendURL = process.env.FRONTEND_URL;
    const resetURL = `${frontendURL}/reset-password/${finalTokenToSend}`; 
    const subject = "Password Reset Link for My-Portfolio";
    const text = `You requested a password reset. Please use the following link to reset your password: ${resetURL}`;
    const html = `
     <div style="font-family: 'Poppins', Arial, sans-serif; 
                 padding: 15px; border-radius: 12px; max-width: 600px; width: 90%; 
                 margin: 20px auto; background-color: #ffffff; border: 1px solid #e0e0e0;
                 box-shadow: 0 4px 12px rgba(0,0,0,0.05); box-sizing: border-box;">

        <h2 style="color: #222; border-left: 5px solid #2196F3; padding-left: 10px; font-size: 20px; margin-bottom: 20px; line-height: 1.2;">
            Password Reset Request
        </h2>
        
        <p style="font-size: 15px; color: #333; margin-top: 0;">
            Hello <strong>${user.name}</strong>,
        </p>
        
        <p style="font-size: 15px; color: #555; line-height: 1.6;">
            We received a request to reset the password for your account (<strong>${user.email}</strong>). 
            If you did not make this request, please ignore this email.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetURL}" 
               style="display: inline-block; padding: 15px 30px; font-size: 17px; color: #fff; 
                      background: linear-gradient(135deg, #2196F3, #21CBF3); border-radius: 8px; 
                      text-decoration: none; font-weight: 700; transition: background 0.3s; white-space: nowrap;"> 
                Reset My Password
            </a>
        </div>

        <p style="font-size: 13px; color: #777; line-height: 1.4;">
            This link is valid for <strong>1 hour</strong>. 
            If the button above does not work, please copy and paste the link below into your browser:
        </p>
        <p style="font-size: 13px; color: #2196F3; word-break: break-all;">
            ${resetURL}
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">

        <p style="font-size: 13px; color: #999;">
            Thank you, <br>
            <strong>The My-Portfolio Team</strong>
        </p>
    </div>
    `;

    await sendEmail(user.email, subject, text, html);

    res.status(200).json({
      message: "Password reset link sent to your email.",
      resetToken: finalTokenToSend, // Sent for testing purposes
    });
  } catch (error) {
    console.error("Password reset request failed:", error.message);
    res.status(500).json({ error: 'Failed to send reset email.' }); 
  }
};


// ---------------------------------------------------------------------
// | 3. PASSWORD RESET FLOW: RESET PASSWORD                            |
// ---------------------------------------------------------------------

/**
 * @desc Resets the user's password using the token provided in the URL params.
 * @route PUT /api/users/resetpassword/:token
 * @access Public
 */
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  
  // Only using the raw token from the URL for the query
  const tokenToQueryDB = token; 

  try {
    // 1. Find the token document (checks expiration automatically)
    const resetTokenDoc = await PasswordResetToken.findOne({
      token: tokenToQueryDB,
      expiresAt: { $gt: Date.now() }, // Check expiration time
    });

    if (!resetTokenDoc) {
      throw Error("Password reset token is invalid or has expired.");
    }
    
    // 2. Find the user associated with the token
    const user = await User.findById(resetTokenDoc.userId);

    if (!user) {
        throw Error("User not found for this reset token."); 
    }

    if (!password) {
      throw Error("New password must be provided.");
    }

    // 3. Hash the new password and save to the User model
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();
    
    // 4. Delete the token document (used token cannot be reused)
    await PasswordResetToken.deleteOne({ _id: resetTokenDoc._id });


    res.status(200).json({
      message: "Password has been successfully reset",
    });
  } catch (error) {
    console.error("Password reset failed:", error.message);
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
  // registerUser, // Uncomment this to enable public registration
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword,
};