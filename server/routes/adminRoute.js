const express = require("express");
const {
  registerUser,
  loginUser,
  assignMentorToStudent,
  getAllMentorAssignments,
  getAdminProfile
} = require("../controllers/adminController");
const { adminAuth, authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (require admin authentication)
router.post("/assign-mentor", adminAuth, assignMentorToStudent);
router.get("/mentor-assignments", adminAuth, getAllMentorAssignments);

// Add profile route
router.get("/profile/:id", authMiddleware, getAdminProfile);

module.exports = router;