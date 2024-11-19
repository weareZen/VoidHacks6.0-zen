import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Menu,
  Bell,
  LogOut,
  User,
  LayoutDashboard,
  Users,
  FileCheck,
  FileText,
  Settings,
  Upload,
  MessageSquare,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return null; // Don't render navbar if user is not logged in

  const getNavItems = () => {
    switch (user?.userType) {
      case 'admin':
        return [
          { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Manage Users', href: '/users', icon: <Users className="w-4 h-4" /> },
          { label: 'Company Verification', href: '/verify', icon: <FileCheck className="w-4 h-4" /> },
          { label: 'Reports', href: '/reports', icon: <FileText className="w-4 h-4" /> },
          { label: 'Settings', href: '/settings', icon: <Settings className="w-4 h-4" /> },
        ];
      case 'mentor':
        return [
          { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Assigned Students', href: '/students', icon: <Users className="w-4 h-4" /> },
          { label: 'Evaluate Reports', href: '/evaluate', icon: <FileText className="w-4 h-4" /> },
        ];
      case 'student':
        return [
          { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Upload Reports', href: '/upload-reports', icon: <Upload className="w-4 h-4" /> },
          { label: 'Upload Certificates', href: '/certificates', icon: <FileCheck className="w-4 h-4" /> },
          { label: 'Mentor Chat', href: '/chat', icon: <MessageSquare className="w-4 h-4" /> },
        ];
      default:
        return [];
    }
  };

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">ZEN</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {getNavItems().map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right side icons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {getNavItems().map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Link>
            ))}
            <hr className="my-2 border-border" />
            <Button variant="ghost" className="w-full justify-start" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
