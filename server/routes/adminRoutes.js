const express = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Professional = require("../models/Professional");
const Booking = require("../models/Booking");
const Service = require("../models/Service");

const adminAuthMiddleware =
  require("../middleware/adminAuthMiddleware");

const router = express.Router();


// =========================================
// ADMIN LOGIN
// =========================================

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Please enter email and password.",
      });
    }

    const adminEmail =
      process.env.ADMIN_EMAIL;

    const adminPassword =
      process.env.ADMIN_PASSWORD;

    if (
      email.toLowerCase().trim() !==
        adminEmail ||
      password !== adminPassword
    ) {
      return res.status(401).json({
        message:
          "Invalid admin credentials.",
      });
    }

    const token = jwt.sign(
      {
        email: adminEmail,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message:
        "Admin login successful!",

      token,

      admin: {
        email: adminEmail,
        name: "Village Service Admin",
      },
    });
  } catch (error) {
    console.error(
      "Admin login error:",
      error
    );

    res.status(500).json({
      message:
        "Server error during admin login.",
    });
  }
});


// =========================================
// ADMIN DASHBOARD DATA
// =========================================

router.get(
  "/dashboard",
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const [
        customers,
        professionals,
        bookings,
        services,
      ] = await Promise.all([
        User.find()
          .select(
            "name email phone createdAt"
          )
          .sort({
            createdAt: -1,
          }),

        Professional.find()
          .select(
            "name email phone serviceCategory isApproved isAvailable createdAt"
          )
          .sort({
            createdAt: -1,
          }),

        Booking.find()
          .populate("service")
          .populate(
            "customer",
            "name email phone"
          )
          .populate(
            "professional",
            "name email phone"
          )
          .sort({
            createdAt: -1,
          }),

        Service.find()
          .sort({
            createdAt: -1,
          }),
      ]);

      const completedBookings =
        bookings.filter(
          (booking) =>
            booking.status ===
            "Completed"
        );

      const pendingBookings =
        bookings.filter(
          (booking) =>
            booking.status ===
            "Pending"
        );

      const acceptedBookings =
        bookings.filter(
          (booking) =>
            booking.status ===
            "Accepted"
        );

      const revenue =
        completedBookings.reduce(
          (sum, booking) =>
            sum +
            Number(
              booking.total || 0
            ),
          0
        );

      res.json({
        stats: {
          customers:
            customers.length,

          professionals:
            professionals.length,

          bookings:
            bookings.length,

          revenue,
        },

        activity: {
          pending:
            pendingBookings.length,

          accepted:
            acceptedBookings.length,

          completed:
            completedBookings.length,
        },

        customers,

        professionals,

        bookings,

        services,
      });
    } catch (error) {
      console.error(
        "Admin dashboard error:",
        error
      );

      res.status(500).json({
        message:
          "Could not load admin dashboard.",
      });
    }
  }
);


// =========================================
// UPDATE BOOKING STATUS
// =========================================

router.put(
  "/bookings/:bookingId/status",
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const {
        status,
      } = req.body;

      const allowedStatuses = [
        "Pending",
        "Accepted",
        "Rejected",
        "Completed",
        "Cancelled",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid booking status.",
        });
      }

      const booking =
        await Booking.findOne({
          bookingId:
            req.params.bookingId,
        });

      if (!booking) {
        return res.status(404).json({
          message:
            "Booking not found.",
        });
      }

      booking.status = status;

      await booking.save();

      const updatedBooking =
        await Booking.findById(
          booking._id
        )
          .populate("service")
          .populate(
            "customer",
            "name email phone"
          )
          .populate(
            "professional",
            "name email phone"
          );

      res.json({
        message:
          "Booking status updated.",
        booking:
          updatedBooking,
      });
    } catch (error) {
      console.error(
        "Admin booking update error:",
        error
      );

      res.status(500).json({
        message:
          "Could not update booking.",
      });
    }
  }
);


// =========================================
// ADD SERVICE
// =========================================

router.post(
  "/services",
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        category,
        price,
        description,
        image,
      } = req.body;

      if (
        !name ||
        !category ||
        price === undefined
      ) {
        return res.status(400).json({
          message:
            "Name, category and price are required.",
        });
      }

      const service =
        await Service.create({
          name,
          category,
          price: Number(price),
          description:
            description || "",
          image: image || "",
          rating: 0,
          reviews: 0,
          isActive: true,
        });

      res.status(201).json({
        message:
          "Service added successfully.",
        service,
      });
    } catch (error) {
      console.error(
        "Add service error:",
        error
      );

      res.status(500).json({
        message:
          "Could not add service.",
      });
    }
  }
);


// =========================================
// DELETE SERVICE
// =========================================

router.delete(
  "/services/:id",
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const service =
        await Service.findById(
          req.params.id
        );

      if (!service) {
        return res.status(404).json({
          message:
            "Service not found.",
        });
      }

      await Service.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Service deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete service error:",
        error
      );

      res.status(500).json({
        message:
          "Could not delete service.",
      });
    }
  }
);


module.exports = router;