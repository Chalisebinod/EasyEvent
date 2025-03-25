import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import VenueSidebar from "./VenueSidebar";
import { toast, ToastContainer } from "react-toastify";


function EnhancedTransactions() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const accessToken = localStorage.getItem("access_token");
  const [searchParams] = useSearchParams();
  


  // Fetch payments made by users for venues owned by the logged-in owner
  useEffect(() => {
    const fetchPayments = async () => {
       try {
              const response = await axios.get(
                `http://localhost:8000/api/auth/payment/getpayments`,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );
              console.log("Payments",response.data.payments);
              setPayments(response.data.payments);
            } catch (error) {
        console.error("Error fetching owner payments:", error);
      }
    };

    fetchPayments();
  }, []);

  // Refund handler
  const handleRefund = async (bookingId) => {
    // if (!window.confirm("Are you sure you want to refund this payment?")) return;

    // try {
    //   const response = await axios.post(
    //     `http://localhost:8000/api/auth/payment/refund/${paymentId}`,
    //     {},
    //     {
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //       },
    //     }
    //   );

    //   if (response.data.success) {
    //     alert("Refund processed successfully!");
    //     setPayments((prevPayments) =>
    //       prevPayments.map((payment) =>
    //         payment._id === paymentId ? { ...payment, payment_status: "Refunded" } : payment
    //       )
    //     );
    //   } else {
    //     alert("Failed to process refund.");
    //   }
    // } catch (error) {
    //   console.error("Error processing refund:", error);
    //   alert("An error occurred while processing the refund.");
    // }
    try {
            const response = await axios.post(
              "http://localhost:8000/api/auth/payment/initiate",
              {
                amount: 900,
                purchase_order_id: bookingId,
                purchase_order_name: "EasyEvent",
                return_url: `http://localhost:5173/transaction/${bookingId}`,
                website_url: `http://localhost:5173/transaction/${bookingId}`,
                bookingId: bookingId,
                userId: "67b6d065da09b880fa55361a",
              },
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );
    
            if (response.data && response.data.payment_url) {
              // setPaymentUrl(response.data.payment_url);
              window.location.href = response.data.payment_url;
            } else {
              toast.error("Payment initiation failed: No payment URL received.");
            }
          } catch (error) {
            console.error(
              "Payment initiation failed:",
              error.response?.data || error.message
            );
          }
  };


  // Calculate summary data
  const summary = useMemo(() => {
    let totalReceived = 0;
    payments.forEach((payment) => {
      totalReceived += payment.amount;
    });
    return { totalReceived, totalTransactions: payments.length };
  }, [payments]);

  // Filtering Logic
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const userName = payment.user?.name.toLowerCase() || "";
      const matchesName = userName.includes(searchTerm.toLowerCase());
      const paymentDate = new Date(payment.booking?.event_details?.date || payment.created_at);
      return (
        matchesName &&
        (!startDate || paymentDate >= new Date(startDate)) &&
        (!endDate || paymentDate <= new Date(endDate))
      );
    });
  }, [payments, searchTerm, startDate, endDate]);

   useEffect(() => {
      const verifyPayment = async () => {
        const pidx = searchParams.get("pidx");
        if (!pidx) {
          console.error("Missing pidx in URL parameters");
          return;
        }
        try {
          const response = await axios.post(
            "http://localhost:8000/api/auth/payment/refund",
            { pidx },
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          if (response.data.status === "Completed") {
            toast.success("Payment successful!");
            navigate(`/transaction`, { replace: true });
          } else {
            toast.error("Payment verification failed.");
          }
        } catch (error) {
          console.error(
            "Payment verification error:",
            error.response?.data || error.message
          );
        }
      };
  
      if (searchParams.has("pidx")) {
        verifyPayment();
      }
    }, [searchParams, accessToken, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <VenueSidebar />
      <ToastContainer />

      <div className="flex-1 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">User Payment Details</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded shadow p-4 flex flex-col items-center">
            <span className="text-sm text-gray-500">Total Transactions</span>
            <span className="text-3xl font-bold text-gray-800">{summary.totalTransactions}</span>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded shadow p-4 flex flex-col items-center">
            <span className="text-sm text-white">Total Received</span>
            <span className="text-3xl font-bold text-white">Rs. {summary.totalReceived.toFixed(2)}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="Search by user name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />
          
        </div>

        {/* Payments Table */}
        <div className="bg-white shadow rounded p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-200">
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">User Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Venue</th>
                <th className="p-3 text-left">Amount (Rs.)</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/transactions/${payment._id}`)}
                >
                  <td className="p-3">
                    {new Date(payment.booking?.event_details?.date || payment.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3">{payment.user?.name}</td>
                  <td className="p-3">{payment.user?.email}</td>
                  <td className="p-3">{payment.booking?.venue}</td>
                  <td className="p-3">Rs. {payment.amount.toFixed(2)}</td>
                  <td className="p-3">{payment.payment_status}</td>
                  <td className="p-3">
                    {payment.payment_status !== "Refunded" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          handleRefund(payment.booking._id);
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Refund
                      </button>
                    ) : (
                      <span className="text-gray-500">Refunded</span>
                    )}
                  </td>
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
