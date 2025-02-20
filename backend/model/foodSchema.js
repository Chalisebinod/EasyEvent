const mongoose = require("mongoose");
const foodSchema = new mongoose.Schema({
  venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true },
  food_type: { type: String, required: true }, // e.g., "Chicken", "Veg", "Dessert"
  foods: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      description: { type: String },
      custom_options: [{ type: String }], // E.g., "Extra Spicy", "Without Onion"
    },
  ],
});

module.exports = mongoose.model("Food", foodSchema);
