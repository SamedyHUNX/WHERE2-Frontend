import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from "lucide-react";
import axios from 'axios';
import useAuth from "./../../hooks/useAuth"
import config from './../../config';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(config.notifications.getNotifications, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setNotifications(response.data.data.notifications);
        setUnreadCount(response.data.data.notifications.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(config.notifications.markAsRead, {
        notificationIds: [notificationId]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(config.notifications.readAll, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    await markAsRead(notification.id);
    setIsOpen(false);
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'follow':
        navigate(`/public/user/${notification.followerUser.id}`);
        break;
      case 'message':
        navigate(`/public/user/${notification.followerUser.id}`);
        break;
      default:
        // For other notification types, add more cases or default behavior
        if (notification.metadata?.userId) {
          navigate(`/public/user/${notification.metadata.userId}`);
        }
    }
  };

  const NotificationItem = ({ notification }) => {
    const getNotificationContent = () => {
      const { type, metadata, followerUser, user } = notification;
      
      switch (type) {
        case 'follow':
          return (
            <div className="flex items-center space-x-2">
              <img
                src={followerUser?.profile?.profilePictureUrl || '/api/placeholder/32/32'}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <span className="font-medium">
                  {`${followerUser?.profile?.firstName || ''} ${followerUser?.profile?.lastName || ''}`}
                </span>
                <span className="ml-1">{notification.content}</span>
              </div>
            </div>
          );
        case 'message':
          return (
            <div className="flex items-center space-x-2">
              <img
                src={followerUser?.profile?.profilePictureUrl || '/api/placeholder/32/32'}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <span className="font-medium">
                  {`${followerUser?.profile?.firstName || ''} ${followerUser?.profile?.lastName || ''}`}
                </span>
                <span className="ml-1">sent you a message:</span>
                <p className="text-sm text-gray-600 mt-1">{metadata?.messagePreview}</p>
              </div>
            </div>
          );
        default:
          return <div>{notification.content}</div>;
      }
    };

    return (
      <div
        className={`p-4 hover:bg-gray-50 cursor-pointer ${
          !notification.read ? 'bg-blue-50' : ''
        }`}
        onClick={() => handleNotificationClick(notification)}
      >
        {getNotificationContent()}
        <div className="text-xs text-gray-500 mt-1">
          {new Date(notification.createdAt).toLocaleTimeString()}
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <button
        className="relative p-2 text-gray-600 hover:text-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[25vw] bg-white rounded-lg shadow-lg border overflow-hidden z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;