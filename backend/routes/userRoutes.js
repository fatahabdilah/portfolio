const express = require("express");
const { registerUser, loginUser } = require("../controllers/UserController");
const requireAuth = require("../middleware/requireAuth"); // <-- WAJIB: Import Middleware

const router = express.Router();

// POST /api/users/register (PUBLIK)
// router.post("/register", registerUser);

// POST /api/users/login (PUBLIK)
router.post("/login", loginUser);

// --- RUTE DIAMANKAN (DIUJI) ---
// Rute ini HANYA bisa diakses jika requireAuth berhasil
router.get("/profile", requireAuth, (req, res) => {
  // Kita bisa mengakses user ID dari req.user yang ditambahkan oleh middleware
  res.status(200).json({
    message: "Secret access granted! Profile data retrieved.",
    userId: req.user._id,
  });
});

module.exports = router;
