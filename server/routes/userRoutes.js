const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

// =====================================================
// REGISTER USER
// =====================================================
router.post(
  "/register",
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        password,
      } = req.body;

      // Validate fields
      if (
        !name ||
        !email ||
        !phone ||
        !password
      ) {
        return res.status(400).json({
          message:
            "Please fill in all fields.",
        });
      }

      const cleanName = name.trim();
      const cleanEmail =
        email.trim().toLowerCase();
      const cleanPhone =
        phone.trim();

      // Validate password
      if (password.length < 6) {
        return res.status(400).json({
          message:
            "Password must contain at least 6 characters.",
        });
      }

      // Check existing account
      const existingUser =
        await User.findOne({
          email: cleanEmail,
        });

      if (existingUser) {
        return res.status(409).json({
          message:
            "An account with this email already exists.",
        });
      }

      // Hash password
      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      // Create user in MongoDB
      const user =
        await User.create({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          password: hashedPassword,
        });

      console.log(
        "New user registered:",
        user.email
      );

      return res.status(201).json({
        message:
          "Account created successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      return res.status(500).json({
        message:
          "Server error during registration.",
      });
    }
  }
);

// =====================================================
// LOGIN USER
// =====================================================
router.post(
  "/login",
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      if (
        !email ||
        !password
      ) {
        return res.status(400).json({
          message:
            "Please enter your email and password.",
        });
      }

      const cleanEmail =
        email.trim().toLowerCase();

      // Find user
      const user =
        await User.findOne({
          email: cleanEmail,
        });

      if (!user) {
        return res.status(401).json({
          message:
            "Invalid email or password.",
        });
      }

      // Compare password
      const passwordMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!passwordMatch) {
        return res.status(401).json({
          message:
            "Invalid email or password.",
        });
      }

      // Create JWT
      const token =
        jwt.sign(
          {
            userId: user._id,
            email: user.email,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

      return res.json({
        message:
          "Login successful!",
        token,

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      return res.status(500).json({
        message:
          "Server error during login.",
      });
    }
  }
);

module.exports = router;