const express = require("express");
const {
  registerUser,
  loginUser,
  assignMentorToStudent,
  getAllMentorAssignments
} = require("../controllers/adminController");
const { adminAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (require admin authentication)
router.post("/assign-mentor", adminAuth, assignMentorToStudent);
router.get("/mentor-assignments", adminAuth, getAllMentorAssignments);

module.exports = router;