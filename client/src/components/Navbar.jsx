import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { 
  Home, Users, FileText, Bell, 
  User, LogOut, ChevronDown
} from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const [activeDropdown, setActiveDropdown] = useState(null)
  
  const navbarConfig = {
    admin: [
      { label: 'Dashboard', icon: <Home size={18} />, path: '/admin/dashboard' },
      { 
        label: 'Manage Users', 
        icon: <Users size={18} />, 
        subItems: [
          { label: 'Students', path: '/admin/manageStudents' },
          { label: 'Mentors', path: '/admin/manageMentors' }
        ]
      },
      { label: 'Reports', icon: <FileText size={18} />, path: '/admin/reports' },
      { label: 'Notifications', icon: <Bell size={18} />, path: '/admin/notifications' },
      { label: 'Profile', icon: <User size={18} />, path: '/admin/profile' },
      { label: 'Logout', icon: <LogOut size={18} />, path: '/logout', onClick: logout }
    ],
    mentor: [
      { label: 'Dashboard', icon: <Home size={18} />, path: '/mentor/dashboard' },
      { label: 'Students', icon: <Users size={18} />, path: '/mentor/students' },
      { label: 'Reports', icon: <FileText size={18} />, path: '/mentor/evaluate-reports' },
      { label: 'Notifications', icon: <Bell size={18} />, path: '/mentor/notifications' },
      { label: 'Profile', icon: <User size={18} />, path: '/mentor/profile' },
      { label: 'Logout', icon: <LogOut size={18} />, path: '/logout', onClick: logout }
    ],
    student: [
      { label: 'Dashboard', icon: <Home size={18} />, path: '/student/dashboard' },
      { label: 'Reports', icon: <FileText size={18} />, path: '/student/upload-reports' },
      { label: 'Notifications', icon: <Bell size={18} />, path: '/student/notifications' },
      { label: 'Profile', icon: <User size={18} />, path: '/student/profile' },
      { label: 'Logout', icon: <LogOut size={18} />, path: '/logout', onClick: logout }
    ]
  }

  const navItems = navbarConfig[user?.userType] || []

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto flex justify-between items-center py-3">
        {/* Logo */}
        <div className="text-md font-bold text-gray-800">
          Internship Portal
        </div>

        {/* Navigation Items */}
        <div className="flex items-center space-x-5">
          {navItems.map((item, index) => (
            <div 
              key={index} 
              className="relative group"
              onMouseEnter={() => item.subItems && setActiveDropdown(index)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {item.subItems ? (
                <div className="relative">
                  <button 
                    className="flex items-center text-sm text-gray-700 
                    hover:text-blue-600 transition-colors duration-200 
                    space-x-1"
                  >
                    {item.icon}
                    <span className="ml-1">{item.label}</span>
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                  
                  {activeDropdown === index && (
                    <div 
                      className="absolute top-full right-0 mt-2 
                      bg-white shadow-lg rounded-md 
                      border border-gray-200 overflow-hidden 
                      min-w-[180px] z-50"
                    >
                      {item.subItems.map((subItem, subIndex) => (
                        <Link 
                          key={subIndex} 
                          href={subItem.path} 
                          className="block px-4 py-2 text-sm 
                          text-gray-700 hover:bg-gray-100 
                          hover:text-blue-600 transition-colors"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href={item.path} 
                  onClick={item.onClick}
                  className="flex items-center text-sm text-gray-700 
                  hover:text-blue-600 transition-colors duration-200 
                  space-x-1"
                >
                  {item.icon}
                  <span className="ml-1">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </div>

      </div>
    </nav>
  )
}

export default Navbar