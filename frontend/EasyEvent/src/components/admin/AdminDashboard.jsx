import React from "react";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  const upcomingTasks = [
    {
      id: 1,
      task: "Review venue bookings",
      date: "2025-01-15",
      status: "Pending",
    },
    {
      id: 2,
      task: "Approve user registrations",
      date: "2025-01-18",
      status: "In Progress",
    },
    {
      id: 3,
      task: "Prepare monthly report",
      date: "2025-01-20",
      status: "Pending",
    },
  ];

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="ml-64 w-full p-6">
        {/* Page Heading */}
        <header className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage venues, users, and bookings efficiently
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "Total Venues",
            "Total Users",
            "Total Bookings",
            "Pending Requests",
          ].map((title, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center"
            >
              <h3 className="text-sm text-gray-600 uppercase font-medium">
                {title}
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {[11, 131, 0, 0][index]}
              </p>
            </div>
          ))}
        </div>

        {/* Upcoming Tasks */}
        <section className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Upcoming Tasks
          </h3>
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-6 py-3">Task</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingTasks.map((task, index) => (
                  <tr
                    key={task.id}
                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="px-6 py-3">{task.task}</td>
                    <td className="px-6 py-3">{task.date}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          task.status === "Pending"
                            ? "bg-yellow-500 text-white"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
