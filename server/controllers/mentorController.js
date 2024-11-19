const Mentor = require("../models/mentorModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (mentor) => {
  return jwt.sign(
    { id: mentor._id, email: mentor.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" } 
  );
};

// Register Mentor
exports.registerMentor = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, department, officeLocation, password } = req.body;

  try {
    // Check if the mentor already exists
    const existingMentor = await Mentor.findOne({ email });
    if (existingMentor) {
      return res.status(400).json({ message: "Mentor already exists" });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new mentor
    const mentor = new Mentor({
      firstName,
      lastName,
      email,
      phoneNumber,
      department,
      officeLocation,
      password: hashedPassword,
    });

    // Save mentor to database
    await mentor.save();

    // Generate JWT token
    const token = generateToken(mentor);

    // Respond with mentor data and token
    res.status(201).json({
      mentor: {
        id: mentor._id,
        firstName: mentor.firstName,
        lastName: mentor.lastName,
        email: mentor.email,
        department: mentor.department,
        officeLocation: mentor.officeLocation,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login Mentor
exports.loginMentor = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find mentor by email
    const mentor = await Mentor.findOne({ email });
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, mentor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(mentor);

    // Respond with mentor data and token
    res.status(200).json({
      mentor: {
        id: mentor._id,
        firstName: mentor.firstName,
        lastName: mentor.lastName,
        email: mentor.email,
        department: mentor.department,
        officeLocation: mentor.officeLocation,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Mentors
exports.getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Mentor by ID
exports.getMentorById = async (req, res) => {
  const { mentorId } = req.params;

  try {
    const mentor = await Mentor.findById(mentorId).populate("assignedStudents");
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    res.status(200).json(mentor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};