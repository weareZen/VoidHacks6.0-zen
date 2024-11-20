"use client"
import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import Navbar from '../../../components/Navbar';
import ProfileCard from '../../../components/ProfileCard';

export default function StudentProfile() {
  const { user } = useAuth();

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-10">
        <ProfileCard user={user} />
      </div>
    </>
  );
} 
