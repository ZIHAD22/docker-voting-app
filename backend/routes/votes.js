const express = require("express");
const router = express.Router();
const {
  castVote,
  getUserVotes,
  checkUserVote,
} = require("../controllers/voteController");
const { protect } = require("../middleware/auth");

router.post("/", protect, castVote);
router.get("/my-votes", protect, getUserVotes);
router.get("/check/:electionId", protect, checkUserVote);

module.exports = router;
