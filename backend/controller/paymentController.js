const Payment = require("../model/payment");
const axios = require("axios");
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

module.exports = { initiatePayment, verifyPayment };
