require("dotenv").config();

const mongoose = require("mongoose");
const Booking = require("./models/Booking");

async function cleanupOldBookings() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log("MongoDB connected.");

    const bookings =
      await Booking.find()
        .select("_id bookingId service")
        .populate("service");

    const orphanedBookings =
      bookings.filter(
        (booking) => !booking.service
      );

    console.log(
      `Found ${orphanedBookings.length} orphaned booking(s).`
    );

    if (
      orphanedBookings.length ===
      0
    ) {
      console.log(
        "No orphaned bookings found."
      );

      await mongoose.disconnect();
      return;
    }

    const ids =
      orphanedBookings.map(
        (booking) =>
          booking._id
      );

    const result =
      await Booking.deleteMany({
        _id: {
          $in: ids,
        },
      });

    console.log(
      `Deleted ${result.deletedCount} orphaned booking(s).`
    );

    orphanedBookings.forEach(
      (booking) => {
        console.log(
          `Removed: ${
            booking.bookingId
          }`
        );
      }
    );

    await mongoose.disconnect();

    console.log(
      "Cleanup completed successfully."
    );
  } catch (error) {
    console.error(
      "Cleanup error:",
      error
    );

    process.exit(1);
  }
}

cleanupOldBookings();