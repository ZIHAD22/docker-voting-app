const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    sparse: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  votedElections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash phone number before saving (for privacy)
userSchema.pre("save", async function (next) {
  if (!this.isModified("phone")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.phoneHash = await bcrypt.hash(this.phone, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
