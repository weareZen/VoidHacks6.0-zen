import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';
import {
  Home, Users, CheckCircle, FileText, Settings, 
  Bell, User, LogOut, FileUp, MessageCircle, Award,
  Menu, X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { cn } from '../lib/utils';

const Navbar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navbarConfig = {
    admin: [
      { label: 'Manage Students', icon: <Users />, path: '/admin/manageStudents' },
      { label: 'Manage Mentors', icon: <Users />, path: '/admin/manageMentors' },
      { label: 'Verify Companies', icon: <CheckCircle />, path: '/admin/company-verification' },
      { label: 'Reports', icon: <FileText />, path: '/admin/reports' },
      { label: 'Settings', icon: <Settings />, path: '/admin/settings' },
    ],
    mentor: [
      { label: 'My Students', icon: <Users />, path: '/mentor/students' },
      { label: 'Evaluate Reports', icon: <FileText />, path: '/mentor/evaluate-reports' },
      { label: 'Messages', icon: <MessageCircle />, path: '/mentor/messages' },
    ],
    student: [
      { label: 'Upload Reports', icon: <FileUp />, path: '/student/upload-reports' },
      { label: 'Certificates', icon: <Award />, path: '/student/certificates' },
      { label: 'Chat', icon: <MessageCircle />, path: '/student/chat' },
    ]
  };

  const navItems = navbarConfig[user?.userType] || [];

  const NavLink = ({ item, className, onClick }) => {
    const isActive = pathname === item.path;
    
    return (
      <Link 
        href={item.path}
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
          isActive 
            ? "bg-primary text-primary-foreground" 
            : "hover:bg-secondary",
          className
        )}
      >
        {item.icon}
        <span>{item.label}</span>
      </Link>
    );
  };

  const UserMenu = ({ className }) => (
    <div className={cn("flex items-center gap-2", className)}>
      <Button 
        variant="ghost" 
        size="icon"
        className="relative"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute top-0 right-0 h-2 w-2 bg-destructive rounded-full" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        asChild
      >
        <Link href={`/${user?.userType}/profile`}>
          <User className="h-5 w-5" />
        </Link>
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={logout}
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        
        {/* Brand/Logo */}
        <div className="mr-4 flex">
          <Link href="/" className="font-semibold">
          <img src="/svvv.png" alt="" className='w-16 p-2 h-16 mx-auto'/>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </div>
          <UserMenu />
        </div>

        {/* Mobile Navigation */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <UserMenu className="mr-2" />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-4">
                {navItems.map((item) => (
                  <NavLink 
                    key={item.path} 
                    item={item} 
                    onClick={() => setIsOpen(false)}
                  />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;