import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import VenueSidebar from "./VenueSidebar";

function EnhancedTransactions() {
  const navigate = useNavigate();

  // Sample transaction data with pidx for API lookup
  const [transactions, setTransactions] = useState([
    { id: 1, pidx: "txn_12345", date: "2025-03-10", name: "John Doe", cardNumber: "**** 2300", totalAmount: 100, receivedAmount: 0, status: "Partial" },
    { id: 2, pidx: "txn_67890", date: "2025-03-12", name: "Jane Smith", cardNumber: "**** 2300", totalAmount: 2352, receivedAmount: 0, status: "Paid" },
    { id: 3, pidx: "txn_abcde", date: "2025-03-15", name: "Michael Johnson", cardNumber: "**** 2300", totalAmount: 55, receivedAmount: 0, status: "Pending" },
  ]);

  // Fetch actual received amounts from backend
  useEffect(() => {
    transactions.forEach(async (tx) => {
      try {
        const res = await axios.get("http://localhost:5000/api/payment/get", { params: { pidx: tx.pidx } });
        if (res.data?.success) {
          setTransactions((prev) =>
            prev.map((item) =>
              item.id === tx.id ? { ...item, receivedAmount: res.data.received_amount } : item
            )
          );
        }
      } catch (error) {
        console.error(`Error fetching payment for transaction ${tx.pidx}:`, error);
      }
    });
  }, []);

  // Calculate totals
  const { totalReceived, totalPending, totalRefunded, totalTransactions } = useMemo(() => {
    let totalReceived = 0, totalPending = 0, totalRefunded = 0, totalTransactions = transactions.length;

    transactions.forEach((tx) => {
      totalReceived += tx.receivedAmount;
      totalPending += Math.max(0, tx.totalAmount - tx.receivedAmount);
      if (tx.status === "Refunded") totalRefunded += tx.receivedAmount;
    });

    return { totalReceived, totalPending, totalRefunded, totalTransactions };
  }, [transactions]);

  // Filtering Logic
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesName = tx.name.toLowerCase().includes(searchTerm.toLowerCase());
      const txDate = new Date(tx.date);
      return matchesName && (!startDate || txDate >= new Date(startDate)) && (!endDate || txDate <= new Date(endDate));
    });
  }, [transactions, searchTerm, startDate, endDate]);

  const handleRowClick = (transactionId) => navigate(`/transactions/${transactionId}`);

  const handleRefund = (e, transactionId) => {
    e.stopPropagation();
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === transactionId ? { ...tx, status: "Refunded" } : tx
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <VenueSidebar />
      <div className="flex-1 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Management</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded shadow p-4"><span className="text-sm">Total Transactions</span><span className="text-2xl font-semibold">{totalTransactions}</span></div>
          <div className="bg-white rounded shadow p-4"><span className="text-sm">Total Received</span><span className="text-2xl font-semibold">${totalReceived.toFixed(2)}</span></div>
          <div className="bg-white rounded shadow p-4"><span className="text-sm">Total Pending</span><span className="text-2xl font-semibold">${totalPending.toFixed(2)}</span></div>
          <div className="bg-white rounded shadow p-4"><span className="text-sm">Total Refunded</span><span className="text-2xl font-semibold">${totalRefunded.toFixed(2)}</span></div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <input type="text" placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-red-400" />
          <div className="flex gap-2">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded px-2 py-1 focus:ring-1 focus:ring-red-400" />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded px-2 py-1 focus:ring-1 focus:ring-red-400" />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white shadow rounded p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-200">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Card</th>
                <th className="p-2 text-left">Total ($)</th>
                <th className="p-2 text-left">Received ($)</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="border-b hover:bg-gray-100 cursor-pointer" onClick={() => handleRowClick(tx.id)}>
                  <td className="p-2">{tx.date}</td>
                  <td className="p-2">{tx.name}</td>
                  <td className="p-2">{tx.cardNumber}</td>
                  <td className="p-2">${tx.totalAmount.toFixed(2)}</td>
                  <td className="p-2">${tx.receivedAmount.toFixed(2)}</td>
                  <td className={`p-2 ${tx.status === "Refunded" ? "text-red-500" : "text-gray-700"}`}>{tx.status}</td>
                  <td className="p-2"><button onClick={(e) => handleRefund(e, tx.id)} className="text-red-600 hover:underline">Refund</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EnhancedTransactions;
