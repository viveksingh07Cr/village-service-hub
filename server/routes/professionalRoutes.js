const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Professional = require("../models/Professional");
const Booking = require("../models/Booking");
const Service = require("../models/Service");

const professionalAuthMiddleware = require(
  "../middleware/professionalAuthMiddleware"
);

const router = express.Router();


// =========================================
// PROFESSIONAL LOGIN
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

    const normalizedEmail =
      email.toLowerCase().trim();

    let professional =
      await Professional.findOne({
        email: normalizedEmail,
      });


    // Create demo professional automatically
    // the first time the demo account is used.
    if (
      !professional &&
      normalizedEmail ===
        "electrician@vsh.com" &&
      password === "123456"
    ) {
      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      professional =
        await Professional.create({
          name: "Rajesh Kumar",

          email: normalizedEmail,

          phone: "9876543210",

          password: hashedPassword,

          serviceCategory: "Electrician",

          experience: 5,

          address: "",

          isApproved: true,

          isAvailable: true,
        });
    }


    if (!professional) {
      return res.status(401).json({
        message:
          "Invalid professional login details.",
      });
    }


    if (!professional.isApproved) {
      return res.status(403).json({
        message:
          "Your professional account has not been approved yet.",
      });
    }


    const passwordMatch =
      await bcrypt.compare(
        password,
        professional.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Invalid professional login details.",
      });
    }


    const token = jwt.sign(
      {
        userId: professional._id,
        email: professional.email,
        role: "professional",
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }
    );


    res.json({
      message:
        "Professional login successful!",

      token,

      professional: {
        id: professional._id,
        name: professional.name,
        email: professional.email,
        phone: professional.phone,
        serviceCategory:
          professional.serviceCategory,
      },
    });

  } catch (error) {
    console.error(
      "Professional login error:",
      error
    );

    res.status(500).json({
      message:
        "Server error during professional login.",
    });
  }
});


// =========================================
// GET PROFESSIONAL BOOKINGS
// =========================================

router.get(
  "/bookings",
  professionalAuthMiddleware,
  async (req, res) => {
    try {
      const professionalId =
        req.professional.userId;


      const professional =
        await Professional.findById(
          professionalId
        );

      if (!professional) {
        return res.status(404).json({
          message:
            "Professional account not found.",
        });
      }


      // Find services matching this professional.
      const matchingServices =
        await Service.find({
          $or: [
            {
              name:
                professional.serviceCategory,
            },
            {
              category:
                professional.serviceCategory,
            },
          ],
        }).select("_id");


      const serviceIds =
        matchingServices.map(
          (service) => service._id
        );


      const bookings =
        await Booking.find({
          $or: [
            {
              professional:
                professional._id,
            },

            {
              professional: null,
              status: "Pending",
              service: {
                $in: serviceIds,
              },
            },
          ],
        })
          .populate("service")
          .populate(
            "customer",
            "name email phone"
          )
          .sort({
            createdAt: -1,
          });


      res.json({
        bookings,
      });

    } catch (error) {
      console.error(
        "Professional bookings error:",
        error
      );

      res.status(500).json({
        message:
          "Could not load professional bookings.",
      });
    }
  }
);


// =========================================
// UPDATE BOOKING STATUS
// =========================================

router.put(
  "/bookings/:id/status",
  professionalAuthMiddleware,
  async (req, res) => {
    try {
      const {
        status,
      } = req.body;

      const bookingId =
        req.params.id;

      const professionalId =
        req.professional.userId;


      const allowedStatuses = [
        "Accepted",
        "Rejected",
        "Completed",
      ];

      if (
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          message:
            "Invalid booking status.",
        });
      }


      const booking =
        await Booking.findOne({
          bookingId,
        });


      if (!booking) {
        return res.status(404).json({
          message:
            "Booking not found.",
        });
      }


      // Accepting a pending booking
      if (status === "Accepted") {

        if (
          booking.status !== "Pending"
        ) {
          return res.status(400).json({
            message:
              "Only pending bookings can be accepted.",
          });
        }


        if (
          booking.professional &&
          booking.professional.toString() !==
            professionalId
        ) {
          return res.status(403).json({
            message:
              "This booking is already assigned.",
          });
        }


        booking.professional =
          professionalId;

        booking.status =
          "Accepted";
      }


      // Rejecting a pending booking
      else if (
        status === "Rejected"
      ) {

        if (
          booking.status !== "Pending"
        ) {
          return res.status(400).json({
            message:
              "Only pending bookings can be rejected.",
          });
        }

        booking.status =
          "Rejected";
      }


      // Completing an accepted booking
      else if (
        status === "Completed"
      ) {

        if (
          booking.status !==
            "Accepted"
        ) {
          return res.status(400).json({
            message:
              "Only accepted bookings can be completed.",
          });
        }


        if (
          !booking.professional ||
          booking.professional.toString() !==
            professionalId
        ) {
          return res.status(403).json({
            message:
              "This booking does not belong to you.",
          });
        }


        booking.status =
          "Completed";
      }


      await booking.save();


      const updatedBooking =
        await Booking.findById(
          booking._id
        )
          .populate("service")
          .populate(
            "customer",
            "name email phone"
          );


      res.json({
        message:
          `Booking ${status.toLowerCase()} successfully.`,

        booking:
          updatedBooking,
      });

    } catch (error) {
      console.error(
        "Booking status error:",
        error
      );

      res.status(500).json({
        message:
          "Could not update booking status.",
      });
    }
  }
);


module.exports = router;