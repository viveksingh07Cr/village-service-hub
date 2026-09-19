const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const professionalRoutes = require("./routes/professionalRoutes");
const adminRoutes = require("./routes/adminRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/professionals", professionalRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/services", serviceRoutes);
// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Village Service Hub API is running!",
    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected",
  });
});

// Database test route
app.get("/api/test-db", async (req, res) => {
  try {
    const User = require("./models/User");

    const count = await User.countDocuments();

    res.json({
      message: "MongoDB is working correctly!",
      users: count,
    });
  } catch (error) {
    res.status(500).json({
      message: "Database test failed",
      error: error.message,
    });
  }
});

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Village Service Hub server running on port ${PORT}`
  );
});
  })
  .catch((error) => {
    console.error("MongoDB connection failed:");
    console.error(error.message);
  });