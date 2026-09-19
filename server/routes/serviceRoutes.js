const express = require("express");
const router = express.Router();
const Service = require("../models/Service");

// GET all active services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find({
      isActive: { $ne: false },
    }).sort({ createdAt: -1 });

    res.json(services);
  } catch (error) {
    console.error("Get services error:", error);
    res.status(500).json({
      message: "Failed to fetch services",
    });
  }
});

// GET single service
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.json(service);
  } catch (error) {
    console.error("Get service error:", error);
    res.status(500).json({
      message: "Failed to fetch service",
    });
  }
});

module.exports = router;