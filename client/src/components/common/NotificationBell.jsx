import { useState, useContext, useRef, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { NotificationContext } from '../../context/NotificationContext';
import { timeAgo } from '../../utils/formatDate';

const NotificationBell = () => {
  const { unreadCount, notifications, fetchNotifications, markAsRead, markAllRead } = useContext(NotificationContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={handleOpen} className="relative text-white hover:text-gig-teal transition-colors p-2">
        <FaBell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-2 border max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-gig-teal hover:underline">Mark all read</button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-6 text-sm">No notifications</p>
          ) : (
            notifications.slice(0, 5).map((n) => (
              <div
                key={n._id}
                onClick={() => markAsRead(n._id)}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${!n.isRead ? 'bg-blue-50/50' : ''}`}
              >
                <p className="text-sm font-medium text-gray-800">{n.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
