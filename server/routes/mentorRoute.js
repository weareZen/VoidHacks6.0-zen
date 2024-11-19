const express = require("express");
const router = express.Router();
const mentorController = require("../controllers/mentorController");
const { authMiddleware } = require('../middleware/authMiddleware');

// Register Mentor
router.post("/register", mentorController.registerMentor);

// Login Mentor
router.post("/login", mentorController.loginMentor);

// Get all Mentors
router.get("/all", mentorController.getAllMentors);

// Get a particular Mentor by ID
router.get("/profile/:id", authMiddleware, mentorController.getMentorById);

// Add new route for assigned students
router.get("/:mentorId/assigned-students", authMiddleware, mentorController.getAssignedStudents);

// Add these new routes
router.get("/:mentorId/dashboard-stats", mentorController.getDashboardStats);
router.get("/:mentorId/pending-evaluations", mentorController.getPendingEvaluations);
// router.post("/evaluate-report", mentorController.evaluateReport);
// router.post("/create-assignment", mentorController.createAssignment);
// router.get("/:mentorId/notifications", mentorController.getNotifications);

module.exports = router;