// bookingController.js
const BookingRequest = require("../model/request");
const User = require("../model/user");
const VenueOwner = require("../model/venueOwner");
const nodemailer = require("nodemailer");
// Create a new booking request
// Create a new booking request
exports.createBooking = async (req, res) => {
  const userId = req.user.id;

  try {
    const {
      venue,
      hall,
      event_details,
      selected_foods,
      additional_services,
      pricing,
    } = req.body;

    // Check if the user exists in either User or VenueOwner schema
    const userExists = await User.findById(userId);
    const venueOwnerExists = await VenueOwner.findById(userId);

    if (!userExists && !venueOwnerExists) {
      return res.status(404).json({
        message: "User not found in both User and VenueOwner collections",
      });
    }

    // Create new booking instance
    const booking = new BookingRequest({
      user: userId,
      venue,
      hall,
      event_details,
      selected_foods,
      additional_services,
      pricing,
    });

    const savedBooking = await booking.save();
    return res.status(201).json({ booking: savedBooking });
  } catch (error) {
    console.error("Create Booking Error:", error);
    return res.status(500).json({
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

// Edit or update an existing booking's details
exports.updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    // Find booking by ID
    let booking = await BookingRequest.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Optional business logic: disallow update if booking is already cancelled.
    if (booking.status === "Cancelled") {
      return res
        .status(400)
        .json({ message: "Cancelled bookings cannot be updated" });
    }

    // Update the booking details with data from req.body.
    const updateData = { ...req.body, updated_at: new Date() };
    booking = await BookingRequest.findByIdAndUpdate(bookingId, updateData, {
      new: true,
    });
    return res.status(200).json({ booking });
  } catch (error) {
    console.error("Update Booking Error:", error);
    return res.status(500).json({
      message: "Failed to update booking",
      error: error.message,
    });
  }
};

// Cancel a booking by setting its status to "Cancelled"
exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await BookingRequest.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    booking.status = "Cancelled";
    booking.updated_at = new Date();
    await booking.save();
    return res.status(200).json({
      booking,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    return res.status(500).json({
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};

// Permanently delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await BookingRequest.findByIdAndDelete(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Delete Booking Error:", error);
    return res.status(500).json({
      message: "Failed to delete booking",
      error: error.message,
    });
  }
};

// Fetch all booking requests for a specific venue
exports.getRequestsByVenue = async (req, res) => {
  try {
    const { venueId } = req.params; // Get venue ID from request params

    // Find all booking requests for the given venue ID
    let bookingRequests = await BookingRequest.find({ venue: venueId })
      .populate("hall", "name capacity") // Populate hall details
      .populate("selected_foods", "name price") // Populate food details
      .populate("additional_services.name") // Populate additional services
      .sort({ created_at: -1 }); // Sort by newest first

    // Fetch user details manually
    bookingRequests = await Promise.all(
      bookingRequests.map(async (booking) => {
        let user = await User.findById(booking.user).select("name email");
        if (!user) {
          user = await VenueOwner.findById(booking.user).select("name email");
        }
        return {
          ...booking.toObject(),
          user: user
            ? { _id: booking.user, name: user.name, email: user.email }
            : null,
        };
      })
    );

    return res.status(200).json({ requests: bookingRequests });
  } catch (error) {
    console.error("Fetch Requests Error:", error);
    return res.status(500).json({
      message: "Failed to fetch booking requests",
      error: error.message,
    });
  }
};

// Update booking request status (Accept or Reject)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, reason } = req.body; // Expecting a "reason" field as well

    // Validate status
    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find booking request by ID and populate "user" and "venue"
    const booking = await BookingRequest.findById(requestId)
      .populate("user")
      .populate("venue");
    if (!booking) {
      return res.status(404).json({ message: "Booking request not found" });
    }

    // Update status, reason, and timestamp
    booking.status = status;
    booking.reason = reason; // Reason field added to your schema
    booking.updated_at = new Date();
    await booking.save();

    // Build HTML email content based on the status
    let htmlContent = "";
    if (status === "Accepted") {
      htmlContent = `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width:600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <h2 style="color: #2e7d32; text-align: center;">Booking Approved</h2>
              <p>Dear ${booking.user.name},</p>
              <p>Your booking request has been <strong>approved</strong> by <strong>${
                booking.venue.name
              }</strong>.</p>
              <hr style="margin: 20px 0;">
              <h4>Booking Details</h4>
              <ul style="line-height: 1.6;">
                <li><strong>Event Type:</strong> ${
                  booking.event_details.event_type
                }</li>
                <li><strong>Date:</strong> ${new Date(
                  booking.event_details.date
                ).toLocaleDateString()}</li>
                <li><strong>Guest Count:</strong> ${
                  booking.event_details.guest_count
                }</li>
                <li><strong>Total Cost:</strong> ₹${
                  booking.pricing.total_cost
                }</li>
              </ul>
              <p>Thank you for choosing us.</p>
              <div style="text-align: center; margin-top: 30px;">
                <a href=${`http://localhost:5173/continue-payment/${booking._id}`} style="display: inline-block; padding: 10px 20px; background-color: #2e7d32; color: #ffffff; text-decoration: none; border-radius: 5px;">Continue Your Payment</a>
              </div>
              <p style="text-align: right; margin-top: 20px;">Best regards,<br>${
                booking.venue.name
              } Booking Team</p>
            </div>
          </body>
        </html>
        `;
    } else if (status === "Rejected") {
      htmlContent = `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width:600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <h2 style="color: #d32f2f; text-align: center;">Booking Rejected</h2>
              <p>Dear ${booking.user.name},</p>
              <p>We regret to inform you that your booking request has been <strong>rejected</strong> by <strong>${booking.venue.name}</strong>.</p>
              <hr style="margin: 20px 0;">
              <h4>Reason for Rejection</h4>
              <p style="background-color: #ffeeee; padding: 10px; border-radius: 5px;">${reason}</p>
              <p>Please apply again or contact our customer service for further assistance.</p>
              <p style="text-align: right;">Sincerely,<br>${booking.venue.name} Booking Team</p>
            </div>
          </body>
        </html>
        `;
    }

    // Setup nodemailer transporter (using Gmail in this example)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email address from environment variables
        pass: process.env.EMAIL_PASS, // Your email password from environment variables
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.user.email,
      subject:
        status === "Accepted"
          ? "Your Booking Has Been Approved"
          : "Your Booking Request Has Been Rejected",
      html: htmlContent,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Prepare the JSON response with next step instructions
    const nextStep =
      status === "Accepted"
        ? {
            button_text: "Continue Your Payment",
            redirect_url: "/billing",
          }
        : {
            info_message:
              "Your booking was rejected. Please apply again or contact customer service for further assistance.",
          };

    return res.status(200).json({
      booking,
      message: `Booking ${status} successfully and email sent.`,
      next_step: nextStep,
    });
  } catch (error) {
    console.error("Update Request Status Error:", error);
    return res.status(500).json({
      message: "Failed to update booking request status",
      error: error.message,
    });
  }
};

// Fetch all booking details for a specific user (User or VenueOwner)
exports.getBookingByRequestId = async (req, res) => {
  try {
    const { requestId } = req.params;

    // Find the booking request by its ID and populate all relevant fields
    let booking = await BookingRequest.findById(requestId)
      .populate("user", "name email contact profile_image") // Populate user details from User collection
      .populate("venue", "name location") // Populate venue details
      .populate("hall", "name capacity") // Populate hall details
      .populate("selected_foods", "name price") // Populate food details
      .populate("additional_services", "name description"); // Populate additional services

    if (!booking) {
      return res.status(404).json({ message: "Booking request not found" });
    }

    // Extract the raw user ID. If booking.user is already populated, it may be an object.
    // Otherwise, get the raw ID from the document.
    let userId = null;
    if (booking.user) {
      // If booking.user is an object with _id, use that; otherwise, use booking.user as the ID.
      userId =
        typeof booking.user === "object"
          ? booking.user._id || booking.user
          : booking.user;
    } else {
      // If booking.user is null (populate didn't find a match), get the stored user ID.
      userId = booking._doc.user;
    }

    // Try to fetch from the User collection first.
    let user = await User.findById(userId).select(
      "name email contact profile_image"
    );
    // If not found in User, try the VenueOwner collection.
    if (!user) {
      user = await VenueOwner.findById(userId).select(
        "name email contact_number profile_image"
      );
    }
    // Replace the booking.user field with the found user details.
    booking.user = user;

    return res.status(200).json({ booking });
  } catch (error) {
    console.error("Fetch Booking By RequestId Error:", error);
    return res.status(500).json({
      message: "Failed to fetch booking request",
      error: error.message,
    });
  }
};
