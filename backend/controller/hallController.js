const Hall = require("../model/hallSchema");


exports.addHall = async (req, res) => {
    try {
      const hallData = req.body;
      // If images are uploaded, add their file paths to hallData.images
      if (req.files && req.files.length > 0) {
        hallData.images = req.files.map(file => file.path);
      }
      const hall = await Hall.create(hallData);
      return res.status(201).json({ hall });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

  exports.editHall = async (req, res) => {
    try {
      const hallId = req.params.id;
      const updatedData = req.body;
    
      if (req.files && req.files.length > 0) {
        updatedData.images = req.files.map(file => file.path);
      }
      const hall = await Hall.findByIdAndUpdate(hallId, updatedData, { new: true });
      if (!hall) {
        return res.status(404).json({ message: "Hall not found" });
      }
      return res.status(200).json({ hall });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

  exports.deleteHall = async (req, res) => {
    try {
      const hallId = req.params.id;
      const hall = await Hall.findByIdAndDelete(hallId);
      if (!hall) {
        return res.status(404).json({ message: "Hall not found" });
      }
      return res.status(200).json({ message: "Hall deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

  exports.getHallsWithBlockedDates = async (req, res) => {
    try {
      const venueId = req.query.venue || (req.user && req.user.venue);
      if (!venueId) {
        return res.status(400).json({ message: "Venue id is required" });
      }
      const halls = await Hall.find({ venue: venueId });
      const hallsSeparated = halls.map((hall) => {
        const { blocked_dates, ...hallDetails } = hall.toObject();
        return {
          hall: hallDetails,
          blockedDates: blocked_dates
        };
      });
      return res.status(200).json({ halls: hallsSeparated });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

  exports.getHallsProfile = async (req, res) => {
    try {
      if (!req.user || !req.user.venue) {
        return res.status(401).json({ message: "Unauthorized: Venue information missing" });
      }
      const venueId = req.user.venue;
      const halls = await Hall.find({ venue: venueId });
      return res.status(200).json({ halls });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  exports.getHallsByVenue = async (req, res) => {
    try {
        const venueId = req.params.venueId; // Assuming venueId is passed as a route parameter

        if (!venueId) {
            return res.status(400).json({ message: "Venue ID is required" });
        }

        const halls = await Hall.find({ venue: venueId });

        if (!halls.length) {
            return res.status(404).json({ message: "No halls found for this venue" });
        }

        return res.status(200).json({ halls });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};