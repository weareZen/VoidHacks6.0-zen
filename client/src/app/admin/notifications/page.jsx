"use client"
import React from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, XCircle } from 'lucide-react';
import Navbar from '../../../components/Navbar';

const NotificationPage = () => {
  const notifications = [
    { type: 'success', message: 'Your report was approved!', time: '2 hours ago' },
    { type: 'error', message: 'Failed to upload your document.', time: '5 hours ago' },
    { type: 'info', message: 'New updates are available for your profile.', time: '1 day ago' },
    { type: 'warning', message: 'Your session is about to expire. Please save your work.', time: '3 days ago' },
    { type: 'success', message: 'You have successfully registered for the mentorship program.', time: '1 week ago' },
    { type: 'info', message: 'A new version of the app is now available.', time: '2 weeks ago' },
    { type: 'error', message: 'Payment processing failed. Please try again.', time: '3 weeks ago' },
  ];

  const notificationStyles = {
    info: {
      icon: <Info size={20} className="text-blue-500" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    success: {
      icon: <CheckCircle size={20} className="text-green-500" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    warning: {
      icon: <AlertTriangle size={20} className="text-yellow-500" />,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
    },
    error: {
      icon: <XCircle size={20} className="text-red-500" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
  };

  return (
    <>
    <Navbar/>
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <Bell size={24} className="text-gray-500" />
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => {
              const { type, message, time } = notification;
              const { icon, bgColor, textColor } = notificationStyles[type];

              return (
                <div
                  key={index}
                  className={`flex items-center p-4 rounded-lg border shadow-sm ${bgColor}`}
                >
                  <div className="mr-3">{icon}</div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${textColor}`}>{message}</p>
                    <p className="text-xs text-gray-500">{time}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500 text-center">
              No notifications to display.
            </p>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default NotificationPage;
