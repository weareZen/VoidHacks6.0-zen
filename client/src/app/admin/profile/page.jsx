"use client"
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { User, Mail, Phone } from 'lucide-react';

const UserProfile = () => {
  const { user } = useAuth();
  console.log(user)

  // Fallback if user data is missing
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-700 text-sm">Loading user data...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
            <User size={28} className="text-blue-500" />
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <User size={24} className="text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Name</p>
                <p className="text-lg font-semibold text-gray-800">{user.user.name}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <Mail size={24} className="text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-lg font-semibold text-gray-800">{user.user.email}</p>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
              <Phone size={24} className="text-yellow-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Phone Number</p>
                <p className="text-lg font-semibold text-gray-800">
                  {user.phone_number || 'N/A'}
                </p>
              </div>
            </div>

            {/* User Type */}
            <div className="flex items-center p-4 bg-red-50 rounded-lg">
              <User size={24} className="text-red-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">User Type</p>
                <p className="text-lg font-semibold text-gray-800 capitalize">
                  {user.userType}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
