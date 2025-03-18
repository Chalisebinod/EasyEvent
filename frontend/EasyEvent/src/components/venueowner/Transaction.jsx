import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import VenueSidebar from "./VenueSidebar";
import { format } from "date-fns"; // For date formatting (npm install date-fns)

function EnhancedTransactions() {
  const navigate = useNavigate();

  // -----------------------------
  // 1. Sample transaction data
  // -----------------------------
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: "2025-03-10",
      name: "John Doe",
      cardNumber: "**** **** **** 2300",
      totalAmount: 100,
      receivedAmount: 75,
      status: "Partial", // can be "Paid", "Partial", "Pending", "Refunded"
    },
    {
      id: 2,
      date: "2025-03-12",
      name: "Jane Smith",
      cardNumber: "**** **** **** 2300",
      totalAmount: 2352,
      receivedAmount: 2352,
      status: "Paid",
    },
    {
      id: 3,
      date: "2025-03-15",
      name: "Michael Johnson",
      cardNumber: "**** **** **** 2300",
      totalAmount: 55,
      receivedAmount: 0,
      status: "Pending",
    },
  ]);

  // -----------------------------
  // 2. Search & Filters
  // -----------------------------
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // -----------------------------
  // 3. Derived data (totals)
  // -----------------------------
  const { totalReceived, totalPending, totalRefunded, totalTransactions } =
    useMemo(() => {
      let totalReceived = 0;
      let totalPending = 0;
      let totalRefunded = 0; // if you track refunds in your data
      let totalTransactions = transactions.length;

      transactions.forEach((tx) => {
        totalReceived += tx.receivedAmount;
        const pending = tx.totalAmount - tx.receivedAmount;
        totalPending += pending > 0 ? pending : 0;
        if (tx.status === "Refunded") {
          totalRefunded += tx.receivedAmount; // or however you track refunds
        }
      });

      return { totalReceived, totalPending, totalRefunded, totalTransactions };
    }, [transactions]);

  // -----------------------------
  // 4. Filtering logic
  // -----------------------------
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesName = tx.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Date filter check
      const txDate = new Date(tx.date);
      const isAfterStart = startDate ? txDate >= new Date(startDate) : true;
      const isBeforeEnd = endDate ? txDate <= new Date(endDate) : true;

      return matchesName && isAfterStart && isBeforeEnd;
    });
  }, [transactions, searchTerm, startDate, endDate]);

  // -----------------------------
  // 5. Handlers
  // -----------------------------
  // Navigate to details page on row click
  const handleRowClick = (transactionId) => {
    navigate(`/transactions/${transactionId}`);
  };

  // Stop click from propagating when interacting with buttons/inputs
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  // Example: Mark a payment as refunded (you'll integrate your Khalti logic here)
  const handleRefund = (e, transactionId) => {
    e.stopPropagation();
    // TODO: Khalti API integration or confirmation modal
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === transactionId ? { ...tx, status: "Refunded" } : tx
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sticky Sidebar */}
      <div className="sticky top-0 h-screen bg-white shadow-md">
        <VenueSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-8">
        {/* Page Heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Payment Management
        </h1>

        {/* -----------------------------
            A) Summary Cards
        ----------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded shadow p-4 flex flex-col">
            <span className="text-gray-500 text-sm">Total Transactions</span>
            <span className="text-2xl font-semibold">{totalTransactions}</span>
          </div>
          <div className="bg-white rounded shadow p-4 flex flex-col">
            <span className="text-gray-500 text-sm">Total Received</span>
            <span className="text-2xl font-semibold">
              ${totalReceived.toFixed(2)}
            </span>
          </div>
          <div className="bg-white rounded shadow p-4 flex flex-col">
            <span className="text-gray-500 text-sm">Total Pending</span>
            <span className="text-2xl font-semibold">
              ${totalPending.toFixed(2)}
            </span>
          </div>
          <div className="bg-white rounded shadow p-4 flex flex-col">
            <span className="text-gray-500 text-sm">Total Refunded</span>
            <span className="text-2xl font-semibold">
              ${totalRefunded.toFixed(2)}
            </span>
          </div>
        </div>

        {/* -----------------------------
            B) Filters
        ----------------------------- */}
        <div className="bg-white shadow rounded p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search by name */}
          <div className="w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search by user name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-2">
            <div>
              <label className="text-sm text-gray-600">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-red-400"
              />
            </div>
          </div>
        </div>

        {/* -----------------------------
            C) Transactions Table
        ----------------------------- */}
        <div className="bg-white shadow rounded">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              {/* Table Head */}
              <thead className="bg-red-500 text-white">
                <tr>
                  <th className="p-3 text-left font-semibold">Date</th>
                  <th className="p-3 text-left font-semibold">Name</th>
                  <th className="p-3 text-left font-semibold">Card Number</th>
                  <th className="p-3 text-left font-semibold">Total</th>
                  <th className="p-3 text-left font-semibold">Received</th>
                  <th className="p-3 text-left font-semibold">Pending</th>
                  <th className="p-3 text-left font-semibold">Status</th>
                  <th className="p-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="text-gray-700">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => {
                    const pendingAmount = tx.totalAmount - tx.receivedAmount;

                    // Choose a color badge for status
                    let statusColor = "bg-gray-200";
                    if (tx.status === "Paid")
                      statusColor = "bg-green-100 text-green-800";
                    if (tx.status === "Partial")
                      statusColor = "bg-yellow-100 text-yellow-800";
                    if (tx.status === "Pending")
                      statusColor = "bg-red-100 text-red-800";
                    if (tx.status === "Refunded")
                      statusColor = "bg-blue-100 text-blue-800";

                    return (
                      <tr
                        key={tx.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleRowClick(tx.id)}
                      >
                        <td className="p-3">
                          {format(new Date(tx.date), "dd.MM.yyyy HH:mm")}
                        </td>
                        <td className="p-3">{tx.name}</td>
                        <td className="p-3">{tx.cardNumber}</td>
                        <td className="p-3">${tx.totalAmount.toFixed(2)}</td>
                        <td className="p-3">${tx.receivedAmount.toFixed(2)}</td>
                        <td className="p-3">
                          ${pendingAmount > 0 ? pendingAmount.toFixed(2) : 0}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${statusColor}`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-3" onClick={stopPropagation}>
                          {/* Only show Refund if there's something to refund */}
                          {(tx.status === "Paid" ||
                            tx.status === "Partial") && (
                            <button
                              onClick={(e) => handleRefund(e, tx.id)}
                              className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                            >
                              Refund
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="p-3 text-center text-gray-500">
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

export default EnhancedTransactions;
