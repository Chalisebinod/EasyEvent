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
    const { name, location, capacity, price, images, description } = req.body;

    // Find venue and check if it belongs to the venue owner
    const venue = await Venue.findOne({ _id: venueId, owner: venueOwnerId });
    if (!venue) {
      return res
        .status(404)
        .json({ message: "Venue not found or unauthorized" });
    }

    // Update venue details
    venue.name = name || venue.name;
    venue.location = location || venue.location;
    venue.capacity = capacity || venue.capacity;
    venue.price = price || venue.price;
    venue.images = images || venue.images;
    venue.description = description || venue.description;

    const updatedVenue = await venue.save();
    res
      .status(200)
      .json({ message: "Venue updated successfully", venue: updatedVenue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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

async function getAllVenuesForShowcase(req, res) {
    try {
      // Fetch all venues from the database, only selecting the relevant fields
      const venues = await Venue.find({}, 'name description location reviews')
        .populate('reviews.user', 'name') // Populate the user details in the reviews
        .exec();
  
      if (!venues || venues.length === 0) {
        return res.status(404).json({ message: "No venues found" });
      }
  
      // Prepare the venue data with calculated rating
      const venuesWithRating = venues.map(venue => ({
        name: venue.name,
        description: venue.description,
        rating: venue.rating, // Virtual field for rating
        location: venue.location,
      }));
  
      // Return the list of venues with selected fields
      res.status(200).json({ venues: venuesWithRating });
    } catch (error) {
      console.error("Error fetching venues:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

module.exports = {
  createVenue,
  editVenue,
  deleteVenue,
  getAllVenuesForUser,
  getAllVenuesForShowcase,
};
