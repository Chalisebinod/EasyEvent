const Payment = require("../model/payment");
const axios = require("axios");
const BookingRequest = require("../model/request");

require('dotenv').config();

const Khalti_secret_key = process.env.Khalti_secret_key;
const KHALTI_BASE_URL = "https://dev.khalti.com/api/v2/";
const headers = {
  Authorization: `Key ${Khalti_secret_key}`,
  "Content-Type": "application/json",
};

// Initiate Payment
const initiatePayment = async (req, res) => {
  try {
    const {
      amount,
      purchase_order_id,
      purchase_order_name,
      return_url,
      website_url,
      bookingId,
      userId,
    } = req.body;
    const roundedAmount = Math.round(amount); // Ensure proper amount format

    // Find the related booking
    const booking = await BookingRequest.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    if(amount<500){
      return res.status(404).json({ success: false, message: "Payment must be a minimum of 50%." });

    }

    const payload = {
      return_url,
      website_url,
      amount: roundedAmount * 100,
      purchase_order_id,
      purchase_order_name,
    };

    const response = await axios.post(
      `${KHALTI_BASE_URL}epayment/initiate/`,
      payload,
      { headers }
    );

    // Save payment record
    const newPayment = new Payment({
      booking: bookingId,
      user: userId,
      amount: amount,
      payment_method: "Khalti",
      transaction_id: response.data.pidx,
      payment_status: "Pending",
    });

    await newPayment.save();

    res.json(response.data);
  } catch (error) {
    console.error("Khalti Payment Error:", error);

    if (error.response) {
      res.status(error.response.status || 400).json(error.response.data);
    } else if (error.request) {
      res
        .status(500)
        .json({
          message: "No response from Khalti. Check your internet or API URL.",
        });
    } else {
      res
        .status(500)
        .json({
          message: "Request failed before reaching Khalti.",
          error: error.message,
        });
    }
  }
};
const verifyPayment = async (req, res) => {
  try {
    const { pidx } = req.body;

    const response = await axios.post(
      `${KHALTI_BASE_URL}epayment/lookup/`,
      { pidx },
      { headers }
    );

    if (response.data.status !== "Completed") {
      return res
        .status(400)
        .json({ success: false, message: "Payment not completed yet." });
    }

    // Find the payment entry
    const payment = await Payment.findOne({ transaction_id: pidx });
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment record not found." });
    }

    // Update payment status
    payment.payment_status = "Completed";
    await payment.save();

    // Find the related booking
    const booking = await BookingRequest.findById(payment.booking);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    // Update payment status in BookingRequest
    if (payment.amount=1000){
      booking.payment_status = "Paid";
    }else if (payment.amount=500){
      booking.payment_status = "Partially Paid";
    }else{
      booking.payment_status = "Unpaid";

    }

    await booking.save();

    res.json(response.data);
  } catch (error) {
    console.error("Khalti Verification Error:", error);

    if (error.response) {
      res.status(error.response.status || 400).json(error.response.data);
    } else if (error.request) {
      res
        .status(500)
        .json({
          message: "No response from Khalti. Check your internet or API URL.",
        });
    } else {
      res
        .status(500)
        .json({
          message: "Request failed before reaching Khalti.",
          error: error.message,
        });
    }
  }
};

const fetchReceivedAmount = async (req, res) => {
  try {
    const { pidx } = req.body; // Transaction ID

    const response = await axios.post(
      `${KHALTI_BASE_URL}epayment/lookup/`,
      { pidx },
      { headers }
    );

    if (!response.data || response.data.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed or invalid transaction ID.",
      });
    }

    const receivedAmount = response.data.total_amount / 100; // Convert from paisa to NPR

    res.json({
      success: true,
      transaction_id: pidx,
      received_amount: receivedAmount,
      status: response.data.status,
    });
  } catch (error) {
    console.error("Khalti Fetch Amount Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch received amount.",
      error: error.message,
    });
  }
};

const refundPayment = async (req, res) => {
  try {
    const { pidx, refund_amount } = req.body;

    const payment = await Payment.findOne({ transaction_id: pidx });
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found." });
    }

    if (payment.payment_status !== "Completed") {
      return res.status(400).json({ success: false, message: "Only completed payments can be refunded." });
    }

    if (refund_amount > payment.amount) {
      return res.status(400).json({ success: false, message: "Refund amount exceeds the paid amount." });
    }

    const payload = {
      pidx,
      amount: refund_amount * 100, // Convert to paisa
    };

    const response = await axios.post(
      `${KHALTI_BASE_URL}epayment/refund/`,
      payload,
      { headers }
    );

    if (response.data.refund_status !== "Success") {
      return res.status(400).json({
        success: false,
        message: "Refund failed.",
        refund_status: response.data.refund_status,
      });
    }

    // Update payment status in database
    payment.payment_status = "Refunded";
    payment.refunded_amount = refund_amount;
    await payment.save();

    res.json({
      success: true,
      message: "Refund successful",
      refunded_amount: refund_amount,
    });
  } catch (error) {
    console.error("Khalti Refund Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to process refund.",
      error: error.message,
    });
  }
};

module.exports = { initiatePayment, verifyPayment,fetchReceivedAmount,refundPayment };
