const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";

router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
    body("location", "Enter a valid location").isLength({ min: 3 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, location, email, password } = req.body;

    try {
      const salt = await bcrypt.genSalt(10);
      if (!salt) {
        return res.status(500).json({ success: false, message: "Error generating salt" });
      }
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        name,
        location,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      res
        .status(201)
        .json({
          success: true,
          message: "User created successfully",
          user: newUser,
        });
    } catch (error) {
      console.error("Error creating user:", error);

      if (error.code === 11000) {
        return res
          .status(400)
          .json({ success: false, message: "Email already exists" });
      }

      res
        .status(500)
        .json({ success: false, message: "Internal server error", error });
    }
  }
);

router.post(
  "/loginuser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials" });
      }

      const data = {
        userId: user._id,
      };

      const authToken = jwt.sign(data, jwtSecret, { expiresIn: "1h" });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        authToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          location: user.location,
        },
      });
    } catch (error) {
      console.error("Error logging in user:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error", error });
    }
  }
);


module.exports = router;
