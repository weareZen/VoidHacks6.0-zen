const Student = require("../models/studentModel");
const Mentor = require("../models/mentorModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register Student
exports.registerStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      enrollementNumber,
      email,
      phoneNumber,
      password,
      internshipDetails,
    } = req.body;

    const existingStudent = await Student.findOne({
      $or: [{ email }, { enrollementNumber }],
    });
    if (existingStudent) {
      return res.status(400).json({ message: "Email or Enrollment Number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      firstName,
      lastName,
      enrollementNumber,
      email,
      phoneNumber,
      password: hashedPassword,
      internshipDetails,
    });

    await student.save();
    res.status(201).json({ message: "Student registered successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Error registering student", error });
  }
};

// Login Student
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: student._id, userType: student.userType }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ message: "Login successful", token, student });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Get All Students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("internalMentor", "firstName lastName email");
    res.status(200).json({ message: "Students retrieved successfully", students });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving students", error });
  }
};

// Get Particular Student by ID
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id).populate("internalMentor", "firstName lastName email");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student retrieved successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving student", error });
  }
};

// Assign Internal Mentor to a Student
exports.assignInternalMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.body;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    student.internalMentor = mentorId;
    await student.save();

    mentor.assignedStudents.push(student._id);
    await mentor.save();

    res.status(200).json({ message: "Internal mentor assigned successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Error assigning internal mentor", error });
  }
};
