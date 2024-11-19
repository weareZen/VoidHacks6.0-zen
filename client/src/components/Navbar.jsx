import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { 
  Home, Users, CheckCircle, FileText, Settings, Bell, 
  User, LogOut, FileUp, MessageCircle, Award 
} from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  
  const navbarConfig = {
    admin: [
      { label: 'Dashboard', icon: <Home />, path: '/admin/dashboard' },
      { 
        label: 'Manage Users', 
        icon: <Users />, 
        subItems: [
          { label: 'Students', path: '/admin/manage/students' },
          { label: 'Mentors', path: '/admin/manage/mentors' }
        ]
      },
      { label: 'Company Verification', icon: <CheckCircle />, path: '/admin/company-verification' },
      { label: 'Reports', icon: <FileText />, path: '/admin/reports' },
      { label: 'Settings', icon: <Settings />, path: '/admin/settings' },
      { label: 'Notifications', icon: <Bell />, path: '/admin/notifications' },
      { label: 'Profile', icon: <User />, path: '/admin/profile' },
      { label: 'Logout', icon: <LogOut />, path: '/logout', onClick: logout }
    ],
    mentor: [
      { label: 'Dashboard', icon: <Home />, path: '/mentor/dashboard' },
      { label: 'Assigned Students', icon: <Users />, path: '/mentor/students' },
      { label: 'Evaluate Reports', icon: <FileText />, path: '/mentor/evaluate-reports' },
      { label: 'Notifications', icon: <Bell />, path: '/mentor/notifications' },
      { label: 'Profile', icon: <User />, path: '/mentor/profile' },
      { label: 'Logout', icon: <LogOut />, path: '/logout', onClick: logout }
    ],
    student: [
      { label: 'Dashboard', icon: <Home />, path: '/student/dashboard' },
      { label: 'Upload Reports', icon: <FileUp />, path: '/student/upload-reports' },
      { label: 'Upload Certificates', icon: <Award />, path: '/student/upload-certificates' },
      { label: 'Mentor Chat', icon: <MessageCircle />, path: '/student/mentor-chat' },
      { label: 'Notifications', icon: <Bell />, path: '/student/notifications' },
      { label: 'Profile', icon: <User />, path: '/student/profile' },
      { label: 'Logout', icon: <LogOut />, path: '/logout', onClick: logout }
    ]
  }

  const navItems = navbarConfig[user?.userType] || []

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {navItems.map((item, index) => (
            <div key={index} className="relative group">
              {item.subItems ? (
                <div className="dropdown">
                  <button className="flex items-center space-x-2 hover:text-blue-600">
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                  <div className="dropdown-menu hidden group-hover:block absolute bg-white shadow-lg rounded">
                    {item.subItems.map((subItem, subIndex) => (
                      <Link 
                        key={subIndex} 
                        href={subItem.path} 
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link 
                  href={item.path} 
                  onClick={item.onClick}
                  className="flex items-center space-x-2 hover:text-blue-600"
                >
                  {item.icon}
                  <span>{item.label}</span>
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