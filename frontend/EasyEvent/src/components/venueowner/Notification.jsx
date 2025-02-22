import React, { useEffect, useState } from "react";
import axios from "axios";
import VenueSidebar from "./VenueSidebar";

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

  const clearNotifications = async () => {
    // Optionally, you can add an API call here to clear notifications on the server.
    try {
      // Example API call:
      // const token = localStorage.getItem("access_token");
      // await axios.delete("http://localhost:8000/api/notification/clearAll", {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear notifications", err);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Section */}
      <VenueSidebar />

      {/* Main Content Section */}
      <div className="flex-1 p-6 bg-gray-100">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {loading && <p>Loading notifications...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && notifications.length === 0 && (
            <p className="text-gray-600">No notifications found.</p>
          )}

          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                onClick={() => markAsRead(notification._id)}
                className={`p-4 border rounded-lg cursor-pointer transition duration-300 ${
                  notification.read
                    ? "bg-gray-200 border-gray-300"
                    : "bg-white border-gray-200 hover:shadow-md"
                }`}
              >
                <p className="text-gray-800">{notification.message}</p>
                <span className="text-gray-500 text-sm">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Notification;
