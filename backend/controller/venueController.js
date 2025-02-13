const Venue = require("../model/venue");
const VenueOwner = require("../model/venueOwner");
const { getVenueOwner } = require("./adminController");

const getAllVenuesForUser = async (req, res) => {
  try {
    const venueOwnerId = req.user.id; // Extract venue owner ID from auth middleware

    // Check if venue owner exists
    const venueOwner = await VenueOwner.findById(venueOwnerId);
    if (!venueOwner) {
      return res.status(404).json({ message: "Venue Owner not found" });
    }

    // Fetch all venues owned by the venue owner
    const venues = await Venue.find({ owner: venueOwnerId });

    // Check if the owner has any venues
    if (venues.length === 0) {
      return res.status(404).json({ message: "No venues found for this user" });
    }

    res.status(200).json({
      message: "Venues fetched successfully",
      venues: venues,
    });
  } catch (error) {
    console.error("Error fetching venues:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller to create a new venue
const createVenue = async (req, res) => {
  console.log("Creating venue...");
  try {
    const venueOwnerId = req.user.id; // Extract venue owner ID from auth middleware

    // Extracting fields from request body
    const {
      name,
      location,
      capacity,
      price,
      images,
      description,
      amenities,
      contact_number,
    } = req.body;

    // Check if venue owner exists
    const venueOwner = await VenueOwner.findById(venueOwnerId);
    if (!venueOwner) {
      return res.status(404).json({ message: "Venue Owner not found" });
    }

    // Validate location fields
    if (
      !location ||
      !location.address ||
      !location.city ||
      !location.state ||
      !location.zip_code
    ) {
      return res.status(400).json({
        message:
          "All location fields (address, city, state, zip_code) are required",
      });
    }

    // Create a new venue
    const newVenue = new Venue({
      name,
      location: {
        address: location.address,
        city: location.city,
        state: location.state,
        zip_code: location.zip_code,
      },
      capacity,
      price,
      images,
      description,
      amenities,
      contact_number,
      owner: venueOwnerId,
    });

    // Save venue and update venue owner's venue list
    const savedVenue = await newVenue.save();
    venueOwner.venues.push(savedVenue._id);
    await venueOwner.save();

    res.status(201).json({
      message: "Venue created successfully",
      venue: savedVenue,
    });
  } catch (error) {
    console.error("Error creating venue:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Edit venue details
async function editVenue(req, res) {
  try {
    const venueOwnerId = req.user.id;
    const venueId = req.params.venueId;
    const { payment_policy, description } = req.body;

    // Find venue and check if it belongs to the venue owner
    const venue = await Venue.findOne({ _id: venueId, owner: venueOwnerId });
    if (!venue) {
      return res
        .status(404)
        .json({ message: "Venue not found or unauthorized" });
    }

    // Update profile image if a new file was uploaded
    if (req.files && req.files.profile_image) {
      // Since profile_image is a single file, use the first element
      venue.profile_image = req.files.profile_image[0].path;
    }

    // Update gallery images if files were uploaded under the "images" field
    if (req.files && req.files.images) {
      const uploadedImages = req.files.images;
      if (uploadedImages.length > 5) {
        return res
          .status(400)
          .json({ message: "You can upload a maximum of 5 images." });
      }
      // Map the uploaded file objects to their storage paths
      const imagesPaths = uploadedImages.map((file) => file.path);
      venue.images = imagesPaths;
    }

    // Update payment policy if provided (merging with the current policy)
    if (payment_policy) {
      let parsedPolicy = payment_policy;
      // If payment_policy comes as a JSON string, parse it
      if (typeof payment_policy === "string") {
        try {
          parsedPolicy = JSON.parse(payment_policy);
        } catch (err) {
          return res
            .status(400)
            .json({ message: "Invalid payment_policy format" });
        }
      }
      venue.payment_policy = { ...venue.payment_policy, ...parsedPolicy };
    }

    // Update description if provided
    if (description) {
      venue.description = description;
    }

    // Update the last_updated timestamp
    venue.last_updated = Date.now();

    const updatedVenue = await venue.save();
    res
      .status(200)
      .json({ message: "Venue updated successfully", venue: updatedVenue });
  } catch (error) {
    console.error("Error editing venue:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Delete a venue
async function deleteVenue(req, res) {
  try {
    const venueOwnerId = req.user.id;
    const venueId = req.params.venueId;

    // Find and delete the venue if it belongs to the venue owner
    const venue = await Venue.findOneAndDelete({
      _id: venueId,
      owner: venueOwnerId,
    });
    if (!venue) {
      return res
        .status(404)
        .json({ message: "Venue not found or unauthorized" });
    }

    // Remove venue reference from venue owner's venues list
    await VenueOwner.findByIdAndUpdate(venueOwnerId, {
      $pull: { venues: venueId },
    });

    res.status(200).json({ message: "Venue deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// Venue Profile for the venueOwner
const getVenueProfile = async (req, res) => {
  try {
    const venueOwnerId = req.user.id;
    const venue = await Venue.findOne({ owner: venueOwnerId })
      .populate("reviews.user", "name") // Populate review user details (e.g. name)
      .populate("event_pricing.hall"); // Populate hall details in event pricing if any

    if (!venue) {
      return res
        .status(404)
        .json({ message: "Verify Kyc First to see your venue" });
    }

    res.status(200).json({
      message: "Venue profile fetched successfully",
      venueId: venue._id, // Explicitly including venue ID
      venue, // Returning full venue details
    });
  } catch (error) {
    console.error("Error fetching venue profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllVenuesForShowcase = async (req, res) => {
  try {
    // Fetch all venues with all required details
    const venues = await Venue.find({})
      .populate("reviews.user", "name") // Populate user details in reviews
      .populate("event_pricing.hall", "name capacity") // Populate hall details
      .exec();

    if (!venues || venues.length === 0) {
      return res.status(404).json({ message: "No venues found" });
    }

    // Prepare the venue data with all relevant fields
    const venuesWithDetails = venues.map((venue) => ({
      id: venue._id,
      name: venue.name,
      description: venue.description,
      location: venue.location,
      profile_image: venue.profile_image,
      images: venue.images,
      event_pricing: venue.event_pricing.map((pricing) => ({
        event_type: pricing.event_type,
        pricePerPlate: pricing.pricePerPlate,
        description: pricing.description,
        services_included: pricing.services_included,
        hall: pricing.hall
          ? {
              id: pricing.hall._id,
              name: pricing.hall.name,
              capacity: pricing.hall.capacity,
            }
          : null,
      })),
      additional_services: venue.additional_services,
      contact_details: venue.contact_details,
      payment_policy: venue.payment_policy,
      verification_status: venue.verification_status,
      reported_count: venue.reported_count,
      status: venue.status,
      date_created: venue.date_created,
      last_updated: venue.last_updated,
      rating:
        venue.reviews.length > 0
          ? (
              venue.reviews.reduce((acc, review) => acc + review.rating, 0) /
              venue.reviews.length
            ).toFixed(1)
          : "No ratings yet",
      reviews: venue.reviews.map((review) => ({
        user: review.user.name,
        comment: review.comment,
        rating: review.rating,
        date: review.date,
      })),
    }));

    // Return the list of venues with all details
    res.status(200).json({ venues: venuesWithDetails });
  } catch (error) {
    console.error("Error fetching venues:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getVenueById = async (req, res) => {
  try {
    const { id } = req.params; // Extract venue ID from route parameters

    // Find the venue by its ID and populate necessary fields
    const venue = await Venue.findById(id)
      .populate("reviews.user", "name") // Populate review user details (e.g., name)
      .populate("event_pricing.hall"); // Populate hall details in event pricing if any

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    res.status(200).json({
      message: "Venue profile fetched successfully",
      venueId: venue._id, // Explicitly include the venue ID
      venue, // Return the full venue details
    });
  } catch (error) {
    console.error("Error fetching venue profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createVenue,
  editVenue,
  deleteVenue,
  getAllVenuesForUser,
  getAllVenuesForShowcase,
  getVenueProfile,
  getVenueById,
};
