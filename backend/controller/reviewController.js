// controllers/reviewController.js
import Review from "../models/Review.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";

// Submit a Review
export const submitReview = async (req, res) => {
  try {
    const { venueOwnerId, rating, review } = req.body;
    const userId = req.user.id;

    // Check if the venue owner exists
    const venueOwner = await User.findById(venueOwnerId);
    if (!venueOwner)
      return res.status(404).json({ message: "Venue owner not found" });

    // Save review
    const newReview = new Review({ venueOwnerId, userId, rating, review });
    await newReview.save();

    res
      .status(201)
      .json({ message: "Review submitted successfully", review: newReview });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Reviews for a Venue Owner
export const getVenueReviews = async (req, res) => {
  try {
    const { venueOwnerId } = req.params;
    const reviews = await Review.find({ venueOwnerId }).populate(
      "userId",
      "name email"
    );

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Send Email to User with Review Link
export const sendReviewLink = async (req, res) => {
  try {
    const { userEmail, venueOwnerId } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const reviewLink = `http://localhost:8000/review?venueOwnerId=${venueOwnerId}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Provide Your Review for the Venue",
      text: `Please click on the link to provide your rating & review: ${reviewLink}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Review link sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending email", error });
  }
};
