const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Register Student
router.post("/register", studentController.registerStudent);

// Login Student
router.post("/login", studentController.loginStudent);

// Get all students
router.get("/all", studentController.getAllStudents);

// Get particular student by ID
router.get("/:id", authMiddleware, studentController.getStudentById);
router.get("/reports/:studentId", authMiddleware, studentController.getStudentReports);

// Assign Internal Mentor
router.put("/:id/assign-mentor", studentController.assignInternalMentor);

module.exports = router;