import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VenueSidebar from "./VenueSidebar";

function Transaction() {
  const navigate = useNavigate();

  // Sample transaction data
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: "14.09.2015 00:00",
      name: "John Doe",
      cardNumber: "**** **** **** 2300",
      amount: "$25.00",
      status: "Partial",
    },
    {
      id: 2,
      date: "14.09.2015 00:00",
      name: "Jane Smith",
      cardNumber: "**** **** **** 2300",
      amount: "$2,352.00",
      status: "Fully",
    },
    {
      id: 3,
      date: "14.09.2015 00:00",
      name: "Michael Johnson",
      cardNumber: "**** **** **** 2300",
      amount: "$55.00",
      status: "No",
    },
  ]);

  // Search term
  const [searchTerm, setSearchTerm] = useState("");

  // Filter transactions by user name
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle status change in dropdown
  const handleStatusChange = (id, newStatus) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === id
          ? { ...transaction, status: newStatus }
          : transaction
      )
    );
  };

  // Navigate to details page on row click
  const handleRowClick = (transactionId) => {
    navigate(`/transactions/${transactionId}`);
  };

  // Stop click from propagating when interacting with dropdown
  const handleDropdownClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="flex min-h-screen">
      {/* Sticky Sidebar */}
      <div className="sticky top-0 h-screen bg-white shadow-md">
        <VenueSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50 p-8">
        {/* Page Heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Payment History
        </h1>

        {/* Search Box */}
        <div className="bg-white shadow rounded p-6 mb-6">
          <input
            type="text"
            placeholder="Search by user name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 border border-gray-300 rounded px-3 py-2 
                       focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        {/* Table Container */}
        <div className="bg-white shadow rounded">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              {/* Table Head */}
              <thead className="bg-red-500 text-white">
                <tr>
                  <th className="p-3 text-left font-semibold">Billing Date</th>
                  <th className="p-3 text-left font-semibold">Name</th>
                  <th className="p-3 text-left font-semibold">Card Number</th>
                  <th className="p-3 text-left font-semibold">Amount</th>
                  <th className="p-3 text-left font-semibold">Status</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="text-gray-700">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => handleRowClick(transaction.id)}
                    >
                      <td className="p-3">{transaction.date}</td>
                      <td className="p-3">{transaction.name}</td>
                      <td className="p-3">{transaction.cardNumber}</td>
                      <td className="p-3">{transaction.amount}</td>
                      <td className="p-3" onClick={handleDropdownClick}>
                        <select
                          value={transaction.status}
                          onChange={(e) =>
                            handleStatusChange(transaction.id, e.target.value)
                          }
                          className="border border-gray-300 rounded px-2 py-1 
                                     focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                          <option value="Partial">Partial</option>
                          <option value="Fully">Fully</option>
                          <option value="No">No</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-3 text-center text-gray-500">
                      No results found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transaction;
