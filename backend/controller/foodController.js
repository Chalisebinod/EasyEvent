const Food = require("../model/foodSchema");
const Venue = require("../model/venue");

// Add Food to a Venue
exports.addFood = async (req, res) => {
  try {
    const { venue, food_type, foods } = req.body;

    // Check if the venue exists
    const venueExists = await Venue.findById(venue);
    if (!venueExists) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // Validate food entries
    if (!food_type || !foods || !Array.isArray(foods) || foods.length === 0) {
      return res.status(400).json({ message: "Invalid food details" });
    }

    // Create new Food document
    const newFood = new Food({
      venue,
      food_type,
      foods: foods.map((food) => ({
        name: food.name,
        price: food.price || 0, // Default price is 0 if not provided
        description: food.description || "",
        custom_options: food.custom_options || [],
      })),
    });

    await newFood.save();
    res.status(201).json({ message: "Food added successfully", data: newFood });
  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all foods for a venue
exports.getFoodsByVenue = async (req, res) => {
  try {
    const { venueId } = req.params;
    const foods = await Food.find({ venue: venueId });

    if (!foods || foods.length === 0) {
      return res.status(404).json({ message: "No foods found for this venue" });
    }

    res.status(200).json(foods);
  } catch (error) {
    console.error("Error fetching foods:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
