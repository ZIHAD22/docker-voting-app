const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  party: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "👤",
  },
  votes: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    default: "#006A4E",
  },
});

const electionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["election", "poll"],
    default: "poll",
  },
  category: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: "🗳️",
  },
  status: {
    type: String,
    enum: ["active", "closed", "upcoming"],
    default: "active",
  },
  candidates: [candidateSchema],
  totalVotes: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Election", electionSchema);
