const express = require("express");
const router = express.Router();
const {
  getAllElections,
  getElectionById,
  createElection,
  updateElectionStatus,
  getElectionResults,
} = require("../controllers/electionController");
const { protect } = require("../middleware/auth");

router.get("/", getAllElections);
router.get("/:id", getElectionById);
router.post("/", protect, createElection);
router.put("/:id/status", protect, updateElectionStatus);
router.get("/:id/results", getElectionResults);

module.exports = router;
