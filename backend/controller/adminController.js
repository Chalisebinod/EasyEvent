const User = require("../model/user");
const VenueOwner = require("../model/venueOwner");
const Venue = require("../model/venue");

async function getAllUsers(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sort = "date",
      blockStatus = "all",
    } = req.query; // Removed extra "S"

    // Calculate the starting index
    const startIndex = (parseInt(page) - 1) * parseInt(limit);

    // Build the query for filtering
    let query = { role: "user" };

    if (search) {
      // Add search filter for name, email, or location (adjust fields as needed)
      query = {
        ...query,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ],
      };
    }

    if (blockStatus !== "all") {
      // Add block status filter
      query.is_blocked = blockStatus === "blocked" ? true : false;
    }

    // Sort by date or status
    const sortOptions = sort === "status" ? { status: 1 } : { createdAt: -1 };

    // Get total count of users matching the query
    const totalUsers = await User.countDocuments(query);

    // Fetch users with pagination, filtering, and sorting
    const users = await User.find(query)
      .skip(startIndex)
      .limit(parseInt(limit))
      .sort(sortOptions);

    // Send response with pagination and user data
    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / parseInt(limit)),
        totalUsers: totalUsers,
        pageSize: parseInt(limit),
        hasNextPage: startIndex + parseInt(limit) < totalUsers,
        hasPrevPage: startIndex > 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
}

async function getAllAdmins(req, res) {
  try {
    // Build the query to fetch only admins
    const query = { role: "admin" };

    // Fetch all admins with the query (no pagination or sorting)
    const admins = await User.find(query);

    // Send response with admin data
    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admins",
      error: error.message,
    });
  }
}

async function getAllVenueOwners(req, res) {
  try {
    // Extract page, limit, search, sort, and blockStatus from query parameters, set defaults
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 venue owners per page
    const search = req.query.search || ""; // Search term (optional)
    const sortBy = req.query.sort || "date"; // Default sorting by date
    const blockStatus = req.query.blockStatus || "all"; // Default to "all" block status

    // Calculate the starting index
    const startIndex = (page - 1) * limit;

    // Build the search query
    let searchQuery = { role: "venueOwner" };
    if (search) {
      searchQuery = {
        ...searchQuery,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Handle block status filter
    if (blockStatus !== "all") {
      searchQuery.is_blocked = blockStatus === "blocked" ? true : false;
    }

    // Get total count of venue owners
    const totalVenueOwners = await VenueOwner.countDocuments(searchQuery);

    // Build the sorting options
    let sortOptions = {};
    if (sortBy === "status") {
      sortOptions = { status: 1 }; // Ascending order for status
    } else if (sortBy === "blocked") {
      sortOptions = { is_blocked: 1 }; // Ascending order for blocked status
    } else if (sortBy === "date") {
      sortOptions = { createdAt: -1 }; // Descending order for date (latest first)
    }

    // Fetch venue owners with pagination, search, and sorting
    const venueOwners = await VenueOwner.find(searchQuery)
      .skip(startIndex)
      .limit(limit)
      .sort(sortOptions);

    // Send response with pagination and sorting details
    res.status(200).json({
      success: true,
      data: venueOwners,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalVenueOwners / limit),
        totalVenueOwners: totalVenueOwners,
        pageSize: limit,
        hasNextPage: startIndex + limit < totalVenueOwners,
        hasPrevPage: startIndex > 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch venue owners",
      error: error.message,
    });
  }
}

async function blockUser(req, res) {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId); // Find the venue owner by ID

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Toggle the block status
    user.is_blocked = !user.is_blocked; // If user is blocked, it will be unblocked, and vice versa.
    await user.save(); // Save the updated user document

    res.status(200).json({
      success: true,
      message: user.is_blocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to block/unblock user",
      error: error.message,
    });
  }
}

async function blockVenue(req, res) {
  const { venueId } = req.params;

  try {
    const venue = await Venue.findById(venueId);

    if (!venue) {
      return res
        .status(404)
        .json({ success: false, message: "Venue not found" });
    }

    // Toggle block status for the venue
    venue.is_blocked = !venue.is_blocked;
    await venue.save();

    res.status(200).json({
      success: true,
      message: venue.is_blocked
        ? "Venue blocked successfully."
        : "Venue unblocked successfully.",
      data: venue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to block/unblock venue.",
      error: error.message,
    });
  }
}

/**
 * Toggle block status for a venue owner.
 * Additionally, update all venues belonging to this owner so that their
 * is_blocked status matches the venue owner's block status.
 * Expects req.params.userId to contain the venue owner's ID.
 */
async function blockVenueOwner(req, res) {
  const { userId } = req.params;

  try {
    const user = await VenueOwner.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Venue owner not found" });
    }

    // Toggle the block status
    user.is_blocked = !user.is_blocked;
    await user.save();

    // Update all venues belonging to this venue owner
    await Venue.updateMany({ owner: userId }, { is_blocked: user.is_blocked });

    res.status(200).json({
      success: true,
      message: user.is_blocked
        ? "Venue owner blocked successfully and all venues blocked."
        : "Venue owner unblocked successfully and all venues unblocked.",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to block/unblock venue owner.",
      error: error.message,
    });
  }
}

const getVenueOwner = async (req, res) => {
  const { userId } = req.params; // Get the userId from the request parameters

  try {
    // Find the venue owner by the userId and exclude the password field
    const venueOwner = await VenueOwner.findById(userId).select("-password");

    if (!venueOwner) {
      return res.status(404).json({ message: "Venue owner not found" });
    }

    // Extract createdAt and updatedAt and format them if necessary
    const formattedVenueOwner = {
      ...venueOwner.toObject(),
      date_created: venueOwner.createdAt
        ? venueOwner.createdAt.toLocaleString()
        : null, // Handle createdAt field
      date_updated: venueOwner.updatedAt
        ? venueOwner.updatedAt.toLocaleString()
        : null, // Handle updatedAt field
    };

    // Return the formatted venue owner details
    return res.status(200).json(formattedVenueOwner);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
async function venueForAdmmin(req, res) {
  try {
    const { page = 1, limit = 10, search = "", sort = "date" } = req.query; // Removed any stray characters

    // Calculate the starting index for pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);

    // Build the query for filtering venues
    let query = {};

    if (search) {
      // Add search filter for name, location, or description (adjust fields as needed)
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Define sorting options.
    // If sorting by date, assume a "createdAt" field exists; otherwise, sort by the specified field.
    const sortOptions = sort === "date" ? { createdAt: -1 } : { [sort]: 1 };

    // Get total count of venues matching the query
    const totalVenues = await Venue.countDocuments(query);

    // Fetch venues with pagination, filtering, and sorting
    const venues = await Venue.find(query)
      .skip(startIndex)
      .limit(parseInt(limit))
      .sort(sortOptions);

    // Send response with pagination and venue data
    res.status(200).json({
      success: true,
      data: venues,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalVenues / parseInt(limit)),
        totalVenues: totalVenues,
        pageSize: parseInt(limit),
        hasNextPage: startIndex + parseInt(limit) < totalVenues,
        hasPrevPage: startIndex > 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch venues",
      error: error.message,
    });
  }
}

module.exports = {
  getAllUsers,
  getAllVenueOwners,
  blockUser,
  blockVenueOwner,
  getAllAdmins,
  getVenueOwner,
  venueForAdmmin,
  blockVenue
};
