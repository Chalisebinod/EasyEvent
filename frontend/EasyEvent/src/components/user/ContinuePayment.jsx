import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // Ensure you have react-toastify installed

const paymentOptions = [
  { name: "Khalti", logo: "/khalti-logo.png" },
  { name: "eSewa", logo: "/esewa-logo.png" },
  { name: "IMEpay", logo: "/imepay-logo.png" },
];

export default function ContinuePayment() {
  const [paymentUrl, setPaymentUrl] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentType, setPaymentType] = useState("full"); // "half" or "full"
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(null);

  // Retrieve token from localStorage or define it elsewhere
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) return;
      try {
        const response = await axios.get(`http://localhost:8000/api/book/booking/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data.booking);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch booking details:", error.response?.data || error.message);
        toast.error("Failed to fetch booking details.");
      }
    };
    fetchBookingDetails();
  }, [bookingId, token]);

  const handlePaymentSelect = async (payment) => {
    if (!bookingId) {
      toast.error("Booking ID is missing!");
      return;
    }

    setSelectedPayment(payment);

    // Determine the amount based on the selected payment type
    // const totalAmount = bookings?.pricing?.total_cost*100 || 0; // Example full amount in paisa
    const totalAmount = 1000; // Example full amount in paisa
    const amountToPay = paymentType === "half" ? totalAmount / 2 : totalAmount;

    if (payment === "Khalti") {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/auth/payment/initiate",
          {
            amount: amountToPay, // Amount in paisa
            purchase_order_id: bookingId,
            purchase_order_name: "EasyEvent",
            return_url: `http://localhost:5173/continue-payment/${bookingId}`, // Redirect URL after payment
            website_url: `http://localhost:5173/continue-payment/${bookingId}`,
            bookingId: bookingId,
            userId: bookings?.user._id, // Use the fetched booking details
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPaymentUrl(response.data.payment_url);
        window.location.href = response.data.payment_url; // Redirect to Khalti
      } catch (error) {
        console.error(
          "Payment initiation failed:",
          error.response?.data || error.message
        );
        toast.error("Failed to initiate payment. Please try again.");
      }
    }
  };

  // Verify payment when payment is successful and pidx is available in the URL
  useEffect(() => {
    const verifyPayment = async () => {
      const pidx = searchParams.get("pidx");
      if (!pidx) return;

      if (!token) {
        console.error("Authorization token is missing!");
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
        } else {
          toast.error("Payment verification failed. Please try again.");
        }
      } catch (error) {
        toast.error("Payment verification failed. Please try again.");
      }
    };

    verifyPayment();
  }, [searchParams, token, bookingId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-center mb-4">
          Continue Payment
        </h2>

        {/* Payment Type Selection */}
        <div className="flex justify-center mb-4 space-x-4">
          <button
            className={`px-4 py-2 rounded-md border ${
              paymentType === "half" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setPaymentType("half")}
          >
            Half Payment
          </button>
          <button
            className={`px-4 py-2 rounded-md border ${
              paymentType === "full" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setPaymentType("full")}
          >
            Full Payment
          </button>
        </div>

        {/* Payment Options */}
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
            Selected: {selectedPayment} ({paymentType} payment)
          </p>
        )}
      </div>
    </div>
  );
}
