"use client";
import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import axios from "axios";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);  
  const [isAssignMentorModalOpen, setIsAssignMentorModalOpen] = useState(false);
  const [mentorSearchTerm, setMentorSearchTerm] = useState("");
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    enrollementNumber: "",
    email: "",
    phoneNumber: "",
    password: "",
    internshipDetails: {
      companyName: "",
      companyAddress: "",
      startDate: "",
      endDate: "",
      internshipType: "",
      externalMentor: {
        name: "",
        contactInfo: "",
      },
      status: "Pending",
    },
  });

  // Fetch students and mentors when the component mounts
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/students/all");
        setStudents(response.data.students || response.data || []); // Adjust based on API response structure
      } catch (error) {
        console.error("Error fetching students:", error);
        alert("Failed to fetch students.");
        setStudents([]); // Fallback to an empty array
      }
    };
    const fetchMentors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/mentors/all");
        setMentors(response.data);
      } catch (error) {
        console.error("Error fetching mentors:", error);
        alert("Failed to fetch mentors.");
      }
    };

    fetchStudents();
    fetchMentors();
  }, []);
  
  const handleCreateStudent = async () => {
    if (
      !newStudent.firstName.trim() ||
      !newStudent.lastName.trim() ||
      !newStudent.enrollementNumber.trim() ||
      !newStudent.email.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const studentEntry = {
      ...newStudent,
      internshipDetails: {
        ...newStudent.internshipDetails,
        status: "Pending",
      },
    };

    try {
      console.log(studentEntry)
      const response = await axios.post("http://localhost:5000/api/v1/students/register", studentEntry);
      
      if (response.status === 201) {
        setStudents((prevStudents) => [...prevStudents, response.data]);
        setIsCreateModalOpen(false);
        resetNewStudentForm();
        alert("Student created successfully!");
      } else {
        alert("Failed to create student. Please try again.");
      }
    } catch (error) {
      console.log("Error creating student:", error);
      alert(error.response?.data?.message || "An unexpected error occurred while creating the student.");
    }
  };

  const resetNewStudentForm = () => {
    setNewStudent({
      firstName: "",
      lastName: "",
      enrollementNumber: "",
      email: "",
      phoneNumber: "",
      password: "",
      internshipDetails: {
        companyName: "",
        companyAddress: "",
        startDate: "",
        endDate: "",
        internshipType: "",
        externalMentor: {
          name: "",
          contactInfo: "",
        },
        status: "Pending",
      },
    });
  };

  const handleAssignMentor = async (mentorId) => {
    console.log(mentorId)
    console.log(selectedStudent._id)
    if (!selectedStudent) {
      alert("Please select a student to assign a mentor.");
      return;
    }

    const studentId = selectedStudent._id;  // Assuming the student has an 'id' field

    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/students/${studentId}/assign-mentor`,
        { mentorId }
      );

      if (response.status === 200) {
        // Update the student data with the assigned mentor
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.id === studentId ? { ...student, internalMentor: response.data.mentor } : student
          )
        );
        alert("Mentor assigned successfully!");
        setIsAssignMentorModalOpen(false);
      } else {
        alert("Failed to assign mentor.");
      }
    } catch (error) {
      console.error("Error assigning mentor:", error);
      alert("An error occurred while assigning the mentor.");
    }
  };

  const filteredMentors = mentors.filter(
    (mentor) =>
      `${mentor.firstName} ${mentor.lastName}`.toLowerCase().includes(mentorSearchTerm.toLowerCase()) ||
      mentor.department.toLowerCase().includes(mentorSearchTerm.toLowerCase()) ||
      mentor.email.toLowerCase().includes(mentorSearchTerm.toLowerCase())
  );

  return (
    <>
          <div className="min-h-screen bg-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between item s-center mb-6 pb-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">
              Student Management
            </h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              + Create Student
            </button>
          </div>

          {/* Student Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div
                key={student.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {student.enrollementNumber}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-blue-600">
                    {student.firstName[0]}
                    {student.lastName[0]}
                  </div>
                </div>

                <div className="border-t pt-3 mt-3">
                  <p className="text-sm mb-2 text-gray-600">
                    Internship: {student.internshipDetails.companyName}
                  </p>
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        student.internshipDetails.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {student.internshipDetails.status}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setIsAssignMentorModalOpen(true);
                      }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {student.internalMentor
                        ? `Mentor: ${student.internalMentor.firstName} ${student.internalMentor.lastName}`
                        : "Assign Mentor"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Assign Mentor Modal */}
          {isAssignMentorModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Assign Mentor to {selectedStudent?.firstName}{" "}
                    {selectedStudent?.lastName}
                  </h2>
                  <button
                    onClick={() => setIsAssignMentorModalOpen(false)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Mentor Search */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search mentors"
                    value={mentorSearchTerm}
                    onChange={(e) => setMentorSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />
                </div>

                {/* Mentor List */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredMentors.map((mentor) => (
                    <div
                      key={mentor._id}
                      onClick={() => handleAssignMentor(mentor._id)}
                      className="flex justify-between items-center p-3 rounded hover:bg-gray-100 cursor-pointer"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {`${mentor.firstName} ${mentor.lastName}`}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {mentor.department}
                        </p>
                        <p className="text-xs text-gray-500">{mentor.email}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-blue-600">
                        {mentor.firstName[0]}
                        {mentor.lastName[0]}
                      </div>
                    </div>
                  ))}

                  {filteredMentors.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                      No mentors found
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Create Student Modal (Previous implementation) */}
          {isCreateModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Create New Student
                  </h2>
                  <button
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      resetNewStudentForm();
                    }}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Personal Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={newStudent.firstName}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={newStudent.lastName}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enrollment Number *
                    </label>
                    <input
                      type="text"
                      value={newStudent.enrollementNumber}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          enrollementNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter enrollment number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={newStudent.email}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={newStudent.password}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          password: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter the password"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={newStudent.phoneNumber}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>

                  {/* Internship Details */}
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Internship Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={newStudent.internshipDetails.companyName}
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
                              internshipDetails: {
                                ...newStudent.internshipDetails,
                                companyName: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter company name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Internship Type
                        </label>
                        <select
                          value={newStudent.internshipDetails.internshipType}
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
                              internshipDetails: {
                                ...newStudent.internshipDetails,
                                internshipType: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Type</option>
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Remote">Remote</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={newStudent.internshipDetails.startDate}
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
                              internshipDetails: {
                                ...newStudent.internshipDetails,
                                startDate: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={newStudent.internshipDetails.endDate}
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
                              internshipDetails: {
                                ...newStudent.internshipDetails,
                                endDate: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        External Mentor Name
                      </label>
                      <input
                        type="text"
                        value={newStudent.internshipDetails.externalMentor.name}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            internshipDetails: {
                              ...newStudent.internshipDetails,
                              externalMentor: {
                                ...newStudent.internshipDetails.externalMentor,
                                name: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter external mentor name"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        External Mentor Contact Info
                      </label>
                      <input
                        type="text"
                        value={
                          newStudent.internshipDetails.externalMentor
                            .contactInfo
                        }
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            internshipDetails: {
                              ...newStudent.internshipDetails,
                              externalMentor: {
                                ...newStudent.internshipDetails.externalMentor,
                                contactInfo: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter external contact info"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      resetNewStudentForm();
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateStudent}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Create Student
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentManagement;
