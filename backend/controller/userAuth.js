const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const VenueOwner = require("../model/venueOwner");

// Secret key for JWT (check environment variable JWT_SECRET, fallback to default if not set)
const JWT_SECRET = process.env.JWT_SECRET || "default_secret"; // Ensure this is set in the .env file

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET, // Use the consistent secret variable
    { expiresIn: "7d" } // Token validity: 1 day
  );
};

// Sign-Up Controller
// User Sign-Up Controller
const signup = async (req, res) => {
  const {
    name,
    email,
    password,
    contact_number = null,
    location = null,
    role = "user", // Default role is user
  } = req.body;

  // Validate required fields
  if (!name || !email || !password || !role) {
    return res.status(400).json({
      message:
        "Missing required fields: name, email, password, and role are required.",
    });
  }

  try {
    // Check if the email is already used by a venue owner
    const existingVenueOwner = await VenueOwner.findOne({ email });
    if (existingVenueOwner) {
      return res
        .status(400)
        .json({
          message: `You cannot create an account with the email ${email} because it is already used by a venue owner.`,
        });
    }

    // Check if the user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: `User with email ${email} already exists` });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      contact_number,
      location,
      role,
    });

    // Save the user
    const savedUser = await newUser.save();

    // Generate a token
    const token = generateToken(savedUser);

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// signup venueOwner
const signupVenueOwner = async (req, res) => {
  const {
    name,
    email,
    password,
    contact_number,
    profileImage, // profileImage received from the request body
    role = "venueOwner", // Default role is venueOwner
  } = req.body;

  console.log("Received data:", req.body); // Check if profileImage is in the request

  // Validate required fields
  if (!name || !email || !password || !contact_number || !role) {
    return res.status(400).json({
      message:
        "Missing required fields: name, email, password, contact_number are required.",
    });
  }

  try {
    // Check if the user already exists by email or contact number
    const existingUser = await User.findOne({ email });
    const existingVenueOwner = await VenueOwner.findOne({ email });
    const existingContact = await VenueOwner.findOne({ contact_number });

    if (existingUser || existingVenueOwner) {
      return res
        .status(400)
        .json({
          message: `Email ${email} is already in use by another account.`,
        });
    }

    if (existingContact) {
      return res
        .status(400)
        .json({
          message: `Contact number ${contact_number} is already in use by another venue owner.`,
        });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // If profileImage is not provided, set it to null
    const finalProfileImage = profileImage || null;

    // Create a new venue owner
    const newVenueOwner = new VenueOwner({
      name,
      email,
      password: hashedPassword,
      contact_number,
      role,
      profile_image: finalProfileImage, // Set profileImage to null if not provided
    });

    // Save the venue owner
    const savedVenueOwner = await newVenueOwner.save();

    // Generate a token
    const token = generateToken(savedVenueOwner);

    res
      .status(201)
      .json({ message: "Venue owner registered successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Login Controller
const login = async (req, res) => {
  console.log("User login details : ", req.body); // Log the request body to see if email and password are being sent

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    let user = await User.findOne({ email }); // Try to find as a regular user
    if (!user) {
      user = await VenueOwner.findOne({ email }); // If not, try to find as venueOwner
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Log for debugging purposes
    console.log("User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Log password comparison result for debugging
    console.log("Password match:", isMatch);

    const token = generateToken(user);
    res
      .status(200)
      .json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get User Details Controller
const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the token (added by checkAuthentication middleware)

    // Fetch the user details based on role
    let user;
    if (req.user.role === "venueOwner") {
      user = await VenueOwner.findById(userId).select("-password"); // Exclude password
    } else if (req.user.role === "user") {
      user = await User.findById(userId).select("-password"); // Exclude password
    } else {
      return res.status(403).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user }); // Send the user data back in response
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller for auto-login
const autoLogin = async (req, res) => {
  try {
    // Verify the token

    const userId = req.user.id;

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with user details
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Assuming user has a role field
      },
    });
  } catch (error) {
    console.error("Token validation error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { signup, login, getUserDetails, signupVenueOwner, autoLogin };
