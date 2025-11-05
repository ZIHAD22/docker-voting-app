const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  registerUser,
  getUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Validation rules
const registerValidation = [
  body("phone")
    .matches(/^01[3-9]\d{8}$/)
    .withMessage("Invalid Bangladesh phone number"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email").optional().isEmail().withMessage("Invalid email address"),
];

router.post("/register", registerValidation, registerUser);
router.get("/profile", protect, getUserProfile);

module.exports = router;
