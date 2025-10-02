const express = require("express");
const {
  // registerUser,
  loginUser,
  forgotPassword,
  resetPassword, // <-- WAJIB: Import fungsi resetPassword
} = require("../controllers/UserController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// POST /api/users/login (PUBLIK)
router.post("/login", loginUser);

// POST /api/users/forgot-password (PUBLIK)
router.post("/forgot-password", forgotPassword);

// --- RUTE BARU DITAMBAHKAN ---
// PUT /api/users/resetpassword/:token (PUBLIK)
router.put("/resetpassword/:token", resetPassword); // <-- RUTE YANG HILANG

// --- RUTE DIAMANKAN (DIUJI) ---
router.get("/profile", requireAuth, (req, res) => {
  res.status(200).json({
    message: "Secret access granted! Profile data retrieved.",
    userId: req.user._id,
  });
});

module.exports = router;