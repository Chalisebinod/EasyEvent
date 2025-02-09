import React, { useEffect, useState } from "react";
import axios from "axios";
import VenueSidebar from "./VenueSideBar";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          "http://localhost:8000/api/notification/getVenueOwnerNotification",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNotifications(response.data.notifications);
      } catch (err) {
        setError("Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.put(
        `http://localhost:8000/api/notification/markRead/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow-md rounded-md">
      <VenueSidebar />
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      {loading && <p>Loading notifications...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {notifications.length === 0 && !loading && <p>No notifications found.</p>}
      <ul>
        {notifications.map((notification) => (
          <li
            key={notification._id}
            onClick={() => markAsRead(notification._id)}
            className={`p-3 mb-2 rounded-md shadow-sm cursor-pointer ${
              notification.read ? "bg-gray-300" : "bg-gray-100"
            }`}
          >
            <p>{notification.message}</p>
            <span className="text-gray-500 text-sm">
              {new Date(notification.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;
