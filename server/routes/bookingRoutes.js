const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Booking = require("../models/Booking");
const Service = require("../models/Service");
const authMiddleware = require("../middleware/authMiddleware");

// =====================================================
// CREATE A NEW BOOKING
// =====================================================
router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        service,
        serviceId,
        selectedDate,
        selectedTime,
        address,
      } = req.body;

      // -----------------------------------------------
      // CHECK LOGIN
      // -----------------------------------------------
      const customerId =
        req.user?.id ||
        req.user?._id ||
        req.user?.userId;

      if (!customerId) {
        return res.status(401).json({
          message:
            "User authentication information is missing.",
        });
      }

      // -----------------------------------------------
      // CHECK REQUIRED BOOKING INFORMATION
      // -----------------------------------------------
      if (!service && !serviceId) {
        return res.status(400).json({
          message:
            "Service information is required.",
        });
      }

      if (
        !selectedDate ||
        !selectedTime ||
        !address
      ) {
        return res.status(400).json({
          message:
            "Selected date, selected time and address are required.",
        });
      }

      // -----------------------------------------------
      // FIND SERVICE IN MONGODB
      // -----------------------------------------------
      let dbService = null;

      // Preferred method:
      // use the MongoDB service ID.
      if (serviceId) {
        if (
          !mongoose.Types.ObjectId.isValid(
            serviceId
          )
        ) {
          return res.status(400).json({
            message:
              "Invalid service ID.",
          });
        }

        dbService =
          await Service.findOne({
            _id: serviceId,
            isActive: {
              $ne: false,
            },
          });
      }

      // -----------------------------------------------
      // FALLBACK FOR OLDER REQUESTS
      // -----------------------------------------------
      if (
        !dbService &&
        service?.name
      ) {
        dbService =
          await Service.findOne({
            name: service.name,
            isActive: {
              $ne: false,
            },
          });
      }

      // -----------------------------------------------
      // SERVICE NOT FOUND
      // -----------------------------------------------
      if (!dbService) {
        return res.status(404).json({
          message:
            "Selected service was not found.",
        });
      }

      // -----------------------------------------------
      // CALCULATE PRICE
      // -----------------------------------------------
      const servicePrice = Number(
        dbService.price || 0
      );

      const platformFee = 20;

      const tax = Math.round(
        servicePrice * 0.05
      );

      const total =
        servicePrice +
        platformFee +
        tax;

      // -----------------------------------------------
      // GENERATE BOOKING ID
      // -----------------------------------------------
      const bookingId =
        "VSH-" +
        Date.now()
          .toString()
          .slice(-8) +
        Math.floor(
          100 +
            Math.random() * 900
        );

      // -----------------------------------------------
      // CREATE BOOKING
      // -----------------------------------------------
      const booking =
        await Booking.create({
          bookingId,

          customer: customerId,

          professional: null,

          service: dbService._id,

          selectedDate,

          selectedTime,

          address,

          total,

          status: "Pending",
        });

      // -----------------------------------------------
      // GET COMPLETE BOOKING
      // -----------------------------------------------
      const populatedBooking =
        await Booking.findById(
          booking._id
        )
          .populate(
            "customer",
            "name email phone address"
          )
          .populate(
            "professional",
            "name email phone serviceCategory"
          )
          .populate(
            "service",
            "name category price description image rating reviews"
          );

      // -----------------------------------------------
      // SUCCESS
      // -----------------------------------------------
      return res.status(201).json({
        message:
          "Booking created successfully.",

        booking:
          populatedBooking,
      });
    } catch (error) {
      console.error(
        "Create booking error:",
        error
      );

      return res.status(500).json({
        message:
          error.message ||
          "Failed to create booking.",
      });
    }
  }
);

// =====================================================
// GET CUSTOMER BOOKINGS
// =====================================================
router.get(
  "/customer/:customerId",
  authMiddleware,
  async (req, res) => {
    try {
      const loggedInUserId =
        req.user?.id ||
        req.user?._id ||
        req.user?.userId;

      if (!loggedInUserId) {
        return res.status(401).json({
          message:
            "User authentication information is missing.",
        });
      }

      // -----------------------------------------------
      // USER CAN ONLY VIEW THEIR OWN BOOKINGS
      // -----------------------------------------------
      if (
        String(loggedInUserId) !==
        String(req.params.customerId)
      ) {
        return res.status(403).json({
          message:
            "You can only view your own bookings.",
        });
      }

      // -----------------------------------------------
      // FETCH BOOKINGS
      // -----------------------------------------------
      const bookings =
        await Booking.find({
          customer:
            req.params.customerId,
        })
          .populate(
            "customer",
            "name email phone address"
          )
          .populate(
            "professional",
            "name email phone serviceCategory"
          )
          .populate(
            "service",
            "name category price description image rating reviews"
          )
          .sort({
            createdAt: -1,
          });

      return res.json(
        bookings
      );
    } catch (error) {
      console.error(
        "Get customer bookings error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch customer bookings.",
      });
    }
  }
);

module.exports = router;