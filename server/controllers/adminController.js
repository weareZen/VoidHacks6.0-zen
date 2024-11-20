const Admin = require("../models/adminModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// Admin registration
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone_number } = req.body;

    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
      phone_number,
    });

    await admin.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};


// User login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    const user = {
      name: admin.name,
      email: admin.email,
      phone_number: admin.phone_number,
      userType: "admin"
    }

    res.status(200).json({ message: "Login successful.", token,userType:"admin", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};

// Assign Mentor to Student
exports.assignMentorToStudent = async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if mentor exists
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Check if student already has a mentor
    if (student.internalMentor) {
      // Remove student from previous mentor's assignedStudents
      await Mentor.findByIdAndUpdate(student.internalMentor, {
        $pull: { assignedStudents: student._id }
      });
    }

    // Assign new mentor to student
    student.internalMentor = mentorId;
    await student.save();

    // Add student to mentor's assignedStudents if not already present
    if (!mentor.assignedStudents.includes(student._id)) {
      mentor.assignedStudents.push(student._id);
      await mentor.save();
    }

    // Populate mentor details in response
    const updatedStudent = await Student.findById(studentId)
      .populate('internalMentor', 'firstName lastName email department');

    res.status(200).json({
      message: "Mentor assigned successfully",
      student: updatedStudent
    });

  } catch (error) {
    console.error('Error in assignMentorToStudent:', error);
    res.status(500).json({
      message: "Error assigning mentor to student",
      error: error.message
    });
  }
};

// Get all mentor-student assignments
exports.getAllMentorAssignments = async (req, res) => {
  try {
    const students = await Student.find({ internalMentor: { $exists: true } })
      .populate('internalMentor', 'firstName lastName email department')
      .select('firstName lastName email enrollementNumber internalMentor');

    res.status(200).json({
      message: "Mentor assignments retrieved successfully",
      assignments: students
    });
  } catch (error) {
    console.error('Error in getAllMentorAssignments:', error);
    res.status(500).json({
      message: "Error retrieving mentor assignments",
      error: error.message
    });
  }
};

// Add this new method
exports.getAdminProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id).select('-password');

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "Admin profile retrieved successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone_number: admin.phone_number,
        department: admin.department,
        role: admin.role,
        joiningDate: admin.joiningDate
      }
    });
  } catch (error) {
    console.error('Error in getAdminProfile:', error);
    res.status(500).json({ 
      message: "Error retrieving admin profile", 
      error: error.message 
    });
  }
};