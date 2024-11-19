const express = require("express");
const router = express.Router();
const mentorController = require("../controllers/mentorController");

// Register Mentor
router.post("/register", mentorController.registerMentor);

// Login Mentor
router.post("/login", mentorController.loginMentor);

// Get all Mentors
router.get("/all", mentorController.getAllMentors);

// Get a particular Mentor by ID
router.get("/:mentorId", mentorController.getMentorById);

// Add new route for assigned students
router.get("/:mentorId/assigned-students", mentorController.getAssignedStudents);

module.exports = router;