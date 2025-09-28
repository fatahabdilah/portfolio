const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

require("dotenv").config();

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Token otentikasi diperlukan" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.user = await User.findOne({ _id }).select("_id");

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(401).json({ error: "Unauthorized request" });
  }
};

module.exports = requireAuth;
