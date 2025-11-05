const Vote = require("../models/Vote");
const Election = require("../models/Election");
const User = require("../models/User");

// @desc    Cast a vote
// @route   POST /api/votes
// @access  Private
const castVote = async (req, res) => {
  try {
    const { electionId, candidateId } = req.body;
    const userId = req.user._id;

    // Check if election exists and is active
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    if (election.status !== "active") {
      return res.status(400).json({ message: "Election is not active" });
    }

    // Check if user already voted in this election
    const existingVote = await Vote.findOne({
      user: userId,
      election: electionId,
    });
    if (existingVote) {
      return res
        .status(400)
        .json({ message: "You have already voted in this election" });
    }

    // Check if candidate exists in the election
    const candidate = election.candidates.id(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Create vote record
    const vote = await Vote.create({
      user: userId,
      election: electionId,
      candidate: candidateId,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // Update candidate vote count
    candidate.votes += 1;
    election.totalVotes += 1;
    await election.save();

    // Update user's voted elections
    await User.findByIdAndUpdate(userId, {
      $push: { votedElections: electionId },
    });

    // Emit socket event for real-time update
    req.io.emit("voteUpdate", {
      electionId: electionId,
      candidateId: candidateId,
      votes: candidate.votes,
      totalVotes: election.totalVotes,
    });

    res.status(201).json({
      message: "Vote cast successfully",
      vote: {
        electionId: vote.election,
        candidateId: vote.candidate,
        timestamp: vote.timestamp,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get user's votes
// @route   GET /api/votes/my-votes
// @access  Private
const getUserVotes = async (req, res) => {
  try {
    const votes = await Vote.find({ user: req.user._id })
      .populate("election", "title type")
      .sort({ timestamp: -1 });

    res.json(votes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Check if user voted in election
// @route   GET /api/votes/check/:electionId
// @access  Private
const checkUserVote = async (req, res) => {
  try {
    const vote = await Vote.findOne({
      user: req.user._id,
      election: req.params.electionId,
    });

    res.json({
      hasVoted: !!vote,
      vote: vote
        ? {
            candidateId: vote.candidate,
            timestamp: vote.timestamp,
          }
        : null,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  castVote,
  getUserVotes,
  checkUserVote,
};
