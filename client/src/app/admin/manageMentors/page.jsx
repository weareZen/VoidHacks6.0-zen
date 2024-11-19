"use client"
import React, { useState } from 'react';
import Navbar from '../../../components/Navbar';


const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
  const baseStyles = 'px-4 py-2 rounded-md transition-all duration-300 ease-in-out';
  const variants = {
    primary: 'bg-[#4E6AFF] text-white hover:bg-[#3A4FBC]',
    secondary: 'bg-[#E6EAFF] text-[#4E6AFF] hover:bg-[#D0D9FF]',
    outline: 'border border-[#4E6AFF] text-[#4E6AFF] hover:bg-[#E6EAFF]'
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Custom Input Component
const Input = ({ type = 'text', placeholder, value, onChange, className = '' }) => {
  return (
    <input 
      type={type} 
      placeholder={placeholder} 
      value={value} 
      onChange={onChange}
      className={`w-full px-3 py-2 border border-[#C2D0FF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4E6AFF] ${className}`}
    />
  );
};

// Custom Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold text-[#1A2B5F] mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

const MentorManagement = () => {
  const [mentors, setMentors] = useState([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      department: 'Computer Science',
      assignedStudents: [{ id: 's1', name: 'Alice Smith' }]
    },
    {
      id: '2', 
      firstName: 'Jane', 
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      department: 'Data Science',
      assignedStudents: [{ id: 's2', name: 'Bob Johnson' }]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newMentor, setNewMentor] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: ''
  });

  const filteredMentors = mentors.filter(mentor => 
    `${mentor.firstName} ${mentor.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleCreateMentor = () => {
    const newMentorEntry = {
      ...newMentor,
      id: String(mentors.length + 1),
      assignedStudents: []
    };
    
    setMentors([...mentors, newMentorEntry]);
    setIsCreateModalOpen(false);
    setNewMentor({ firstName: '', lastName: '', email: '', department: '' });
  };

  return (
    <>
    <Navbar/>
    <div className="bg-[#F5F7FF] min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1A2B5F]">Mentor Management</h1>
          <Button 
            onClick={() => setIsCreateModalOpen(true)} 
            variant="primary"
          >
            + Create Mentor
          </Button>
        </div>

        <Input 
          placeholder="Search mentors..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map(mentor => (
            <div 
              key={mentor.id} 
              onClick={() => setSelectedMentor(mentor)}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#E6EAFF] rounded-full flex items-center justify-center mr-4">
                  <span className="text-[#4E6AFF] font-bold">
                    {mentor.firstName[0]}{mentor.lastName[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1A2B5F]">
                    {`${mentor.firstName} ${mentor.lastName}`}
                  </h3>
                  <p className="text-sm text-gray-500">{mentor.department}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>{mentor.email}</p>
                <p>{mentor.assignedStudents.length} Assigned Students</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mentor Details Modal */}
        <Modal 
          isOpen={!!selectedMentor} 
          onClose={() => setSelectedMentor(null)}
          title="Mentor Details"
        >
          {selectedMentor && (
            <div>
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-[#E6EAFF] rounded-full flex items-center justify-center mr-4">
                  <span className="text-[#4E6AFF] font-bold text-2xl">
                    {selectedMentor.firstName[0]}{selectedMentor.lastName[0]}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1A2B5F]">
                    {`${selectedMentor.firstName} ${selectedMentor.lastName}`}
                  </h2>
                  <p className="text-gray-500">{selectedMentor.department}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p><strong>Email:</strong> {selectedMentor.email}</p>
                <p><strong>Assigned Students:</strong></p>
                <ul className="list-disc pl-5">
                  {selectedMentor.assignedStudents.map(student => (
                    <li key={student.id}>{student.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Modal>

        {/* Create Mentor Modal */}
        <Modal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Mentor"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                placeholder="First Name"
                value={newMentor.firstName}
                onChange={(e) => setNewMentor({...newMentor, firstName: e.target.value})}
              />
              <Input 
                placeholder="Last Name"
                value={newMentor.lastName}
                onChange={(e) => setNewMentor({...newMentor, lastName: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
            <Input 
              placeholder="Email"
              type="email"
              value={newMentor.email}
              onChange={(e) => setNewMentor({...newMentor, email: e.target.value})}
            />
            <Input 
              placeholder="Password"
              type="password"
              value={newMentor.password}
              onChange={(e) => setNewMentor({...newMentor, password: e.target.value})}
            />
            </div>
            <Input 
              placeholder="Phone Number"
              value={newMentor.phoneNumber}
              onChange={(e) => setNewMentor({...newMentor, phoneNumber: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
            <Input  
              placeholder="Department"
              value={newMentor.department}
              onChange={(e) => setNewMentor({...newMentor, department: e.target.value})}
            />
            <Input 
              placeholder="Office Location"
              value={newMentor.officeLocation}
              onChange={(e) => setNewMentor({...newMentor, officeLocation: e.target.value})}
            />
            </div>
            <Button 
              onClick={handleCreateMentor} 
              variant="primary" 
              className="w-full"
            >
              Create Mentor
            </Button>
          </div>
        </Modal>
      </div>
    </div>
    </>
  );
};

export default MentorManagement;