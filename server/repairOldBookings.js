require("dotenv").config();

const mongoose = require("mongoose");

const Booking = require("./models/Booking");
const Service = require("./models/Service");

async function repairOldBookings() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log(
      "MongoDB connected."
    );

    // Find all bookings whose service
    // reference cannot be populated.
    const bookings =
      await Booking.find()
        .populate("service");

    const brokenBookings =
      bookings.filter(
        (booking) =>
          !booking.service
      );

    console.log(
      `Found ${brokenBookings.length} booking(s) with a missing service.`
    );

    if (
      brokenBookings.length === 0
    ) {
      console.log(
        "No broken bookings found."
      );

      await mongoose.disconnect();
      return;
    }

    // Load active services.
    const services =
      await Service.find({
        isActive: {
          $ne: false,
        },
      });

    for (const booking of brokenBookings) {
      const total =
        Number(
          booking.total || 0
        );

      let matchingService =
        null;

      /*
        These are the older booking totals
        created by the previous frontend:

        Electrician:
        199 + 20 + 10 = 229

        Plumbing:
        249 + 20 + 12 = 281

        Pest Control:
        499 + 20 + 25 = 544
      */

      if (total === 229) {
        matchingService =
          services.find(
            (service) =>
              service.name ===
              "Electrician"
          );
      }

      if (total === 281) {
        matchingService =
          services.find(
            (service) =>
              service.name ===
              "Plumbing"
          );
      }

      if (total === 544) {
        matchingService =
          services.find(
            (service) =>
              service.name ===
              "Pest Control"
          );
      }

      if (!matchingService) {
        console.log(
          `Could not determine service for booking ${booking.bookingId} (total ₹${total}).`
        );

        continue;
      }

      booking.service =
        matchingService._id;

      await booking.save();

      console.log(
        `Repaired ${booking.bookingId} → ${matchingService.name}`
      );
    }

    await mongoose.disconnect();

    console.log(
      "Booking repair completed."
    );
  } catch (error) {
    console.error(
      "Repair error:",
      error
    );

    process.exit(1);
  }
}

repairOldBookings();