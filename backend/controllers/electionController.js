const Election = require("../models/Election");

// @desc    Get all elections
// @route   GET /api/elections
// @access  Public
const getAllElections = async (req, res) => {
  try {
    const elections = await Election.find({ status: "active" }).sort({
      createdAt: -1,
    });
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single election
// @route   GET /api/elections/:id
// @access  Public
const getElectionById = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);

    if (election) {
      res.json(election);
    } else {
      res.status(404).json({ message: "Election not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create new election
// @route   POST /api/elections
// @access  Private (Admin only - you can add admin middleware)
const createElection = async (req, res) => {
  try {
    const { title, description, type, category, icon, candidates } = req.body;

    const election = await Election.create({
      title,
      description,
      type,
      category,
      icon,
      candidates,
      createdBy: req.user._id,
    });

    res.status(201).json(election);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update election status
// @route   PUT /api/elections/:id/status
// @access  Private (Admin only)
const updateElectionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const election = await Election.findById(req.params.id);

    if (election) {
      election.status = status;
      const updatedElection = await election.save();
      res.json(updatedElection);
    } else {
      res.status(404).json({ message: "Election not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get election results
// @route   GET /api/elections/:id/results
// @access  Public
const getElectionResults = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);

    if (election) {
      const sortedCandidates = election.candidates.sort(
        (a, b) => b.votes - a.votes
      );

      res.json({
        election: {
          title: election.title,
          type: election.type,
          totalVotes: election.totalVotes,
        },
        results: sortedCandidates.map((candidate) => ({
          id: candidate._id,
          name: candidate.name,
          party: candidate.party,
          votes: candidate.votes,
          percentage:
            election.totalVotes > 0
              ? ((candidate.votes / election.totalVotes) * 100).toFixed(2)
              : 0,
        })),
      });
    } else {
      res.status(404).json({ message: "Election not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllElections,
  getElectionById,
  createElection,
  updateElectionStatus,
  getElectionResults,
};
