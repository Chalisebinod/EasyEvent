import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const paymentOptions = [
  { name: "Khalti", logo: "/khalti.png" },
  { name: "eSewa", logo: "/esewa-logo.png" },
  { name: "IMEpay", logo: "/imepay-logo.png" },
];

export default function ContinuePayment() {
  const [paymentUrl, setPaymentUrl] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const { bookingId } = useParams();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  console.log("booking",bookingId);

  // Retrieve token from localStorage
  const token = localStorage.getItem("access_token");

  // If no token, store the full URL and redirect to login
  useEffect(() => {
    if (!token) {
      const redirectUrl = window.location.pathname + window.location.search;
      console.log("Storing redirect URL:", redirectUrl);
      localStorage.setItem("redirect_after_login", redirectUrl);
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  // If no token, render nothing (or a loader)
  if (!token) {
    return null;
  }

  // Payment initiation handler
  const handlePaymentSelect = async (payment) => {
    setSelectedPayment(payment);
    if (payment === "Khalti") {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/auth/payment/initiate",
          {
            amount: 900,
            purchase_order_id: bookingId,
            purchase_order_name: "EasyEvent",
            return_url: `http://localhost:5173/continue-payment/${bookingId}`,
            website_url: `http://localhost:5173/continue-payment/${bookingId}`,
            bookingId: bookingId,
            userId: "67b6d065da09b880fa55361a",
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && response.data.payment_url) {
          setPaymentUrl(response.data.payment_url);
          window.location.href = response.data.payment_url;
        } else {
          toast.error("Payment initiation failed: No payment URL received.");
        }
      } catch (error) {
        console.error(
          "Payment initiation failed:",
          error.response?.data || error.message
        );
        // If token is invalid/expired, redirect to login with current URL stored
        if (error.response && error.response.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("access_token");
          const redirectUrl = window.location.pathname + window.location.search;
          localStorage.setItem("redirect_after_login", redirectUrl);
          navigate("/user-dashboard", { replace: true });
        } else {
          toast.error("Payment initiation failed! Please try again.");
        }
      }
    }
  };

  // Payment verification effect
  useEffect(() => {
    const verifyPayment = async () => {
      const pidx = searchParams.get("pidx");
      if (!pidx) {
        console.error("Missing pidx in URL parameters");
        return;
      }
      try {
        const response = await axios.post(
          "http://localhost:8000/api/auth/payment/verify",
          { pidx },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.status === "Completed") {
          toast.success("Payment successful!");
          navigate(`/success/${bookingId}`, { replace: true });
        } else {
          toast.error("Payment verification failed.");
        }
      } catch (error) {
        console.error(
          "Payment verification error:",
          error.response?.data || error.message
        );
        if (error.response && error.response.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("access_token");
          const redirectUrl = window.location.pathname + window.location.search;
          localStorage.setItem("redirect_after_login", redirectUrl);
          navigate("/login", { replace: true });
        } else {
          toast.error("Payment verification failed. Please try again.");
        }
      }
    };

    if (searchParams.has("pidx")) {
      verifyPayment();
    }
  }, [searchParams, token, bookingId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-center mb-4">
          Continue Payment
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {paymentOptions.map((option) => (
            <button
              key={option.name}
              className={`flex items-center justify-between w-full p-4 border rounded-lg shadow-sm hover:bg-gray-200 transition ${
                selectedPayment === option.name ? "bg-gray-300" : "bg-white"
              }`}
              onClick={() => handlePaymentSelect(option.name)}
            >
              <img src={option.logo} alt={option.name} className="h-6" />
              <span className="ml-2">{option.name}</span>
            </button>
          ))}
        </div>
        {selectedPayment && (
          <p className="text-center mt-4 text-green-600 font-medium">
            Selected: {selectedPayment}
          </p>
        )}
      </div>
    </div>
  );
}
