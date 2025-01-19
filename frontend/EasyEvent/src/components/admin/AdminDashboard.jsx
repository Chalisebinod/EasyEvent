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
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full p-8">
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">
          Admin Dashboard
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            "Total Venues",
            "Total Users",
            "Total Bookings",
            "Pending Requests",
          ].map((title, index) => (
            <div
              key={index}
              className="bg-orange-500 text-white text-center p-6 rounded-lg shadow-lg hover:bg-orange-600 transition-all duration-300"
            >
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="text-3xl font-semibold mt-2">
                {[11, 131, 831, 131][index]}
              </p>
            </div>
          ))}
        </div>

        {/* Upcoming Tasks */}
        <section className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            Upcoming Tasks
          </h3>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="table-auto w-full text-left text-sm">
              <thead>
                <tr className="bg-orange-500 text-white">
                  <th className="px-6 py-4">Task</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-gray-50 transition-all duration-300"
                  >
                    <td className="px-6 py-4">{task.task}</td>
                    <td className="px-6 py-4">{task.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-white ${
                          task.status === "Pending"
                            ? "bg-yellow-500"
                            : "bg-green-500"
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
