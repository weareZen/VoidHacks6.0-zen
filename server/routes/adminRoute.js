const express = require("express");
const {
  registerUser,
  loginUser,
} = require("../controllers/adminController");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
