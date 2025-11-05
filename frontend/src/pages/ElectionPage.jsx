import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { votesAPI } from "../utils/api";
import "./ElectionPage.css";

const ElectionPage = ({ user, elections, onVote }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const election = elections.find((e) => e._id === id);

  if (!election) {
    return (
      <div className="error-screen">
        <h2>Election not found</h2>
        <button onClick={() => navigate("/main")}>Go Back</button>
      </div>
    );
  }

  const hasVoted = user.votedElections?.includes(election._id);

  if (hasVoted) {
    navigate(`/results/${election._id}`);
    return null;
  }

  const handleVote = () => {
    if (selectedCandidate) {
      setShowConfirmation(true);
    }
  };

  const confirmVote = async () => {
    setLoading(true);
    setError("");

    try {
      await votesAPI.castVote({
        electionId: election._id,
        candidateId: selectedCandidate,
      });

      // Update local state
      onVote(election._id, selectedCandidate);

      // Navigate to results
      navigate(`/results/${election._id}`);
    } catch (err) {
      console.error("Vote error:", err);
      setError(
        err.response?.data?.message || "Failed to cast vote. Please try again."
      );
      setShowConfirmation(false);
    } finally {
      setLoading(false);
    }
  };

  const totalVotes = election.totalVotes || 0;

  return (
    <div className="election-page">
      {/* Header */}
      <header className="election-header">
        <button className="back-btn" onClick={() => navigate("/main")}>
          ← Back
        </button>
        <div className="election-title-section">
          <span className="election-icon-large">{election.icon}</span>
          <h1>{election.title}</h1>
          <p>{election.description}</p>
        </div>
      </header>

      {/* Voting Section */}
      <main className="voting-section">
        <div className="voting-container">
          <div className="voting-instructions">
            <h2>Select Your Candidate</h2>
            <p>Click on a candidate card to select, then confirm your vote</p>
            <div className="vote-stats">
              <span>📊 Total Votes: {totalVotes.toLocaleString()}</span>
              <span>👥 {election.candidates?.length || 0} Candidates</span>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="candidates-grid">
            {election.candidates?.map((candidate) => (
              <div
                key={candidate._id}
                className={`candidate-card ${
                  selectedCandidate === candidate._id ? "selected" : ""
                }`}
                onClick={() => !loading && setSelectedCandidate(candidate._id)}
              >
                <div className="candidate-image">
                  <span className="candidate-avatar">{candidate.image}</span>
                  {selectedCandidate === candidate._id && (
                    <div className="selected-badge">
                      <span className="check-icon">✓</span>
                    </div>
                  )}
                </div>
                <div className="candidate-info">
                  <h3>{candidate.name}</h3>
                  <p className="candidate-party">{candidate.party}</p>
                  <div className="candidate-votes">
                    <span className="votes-count">
                      {(candidate.votes || 0).toLocaleString()}
                    </span>
                    <span className="votes-label">current votes</span>
                  </div>
                </div>
                <div
                  className="candidate-color-bar"
                  style={{ background: candidate.color }}
                />
              </div>
            ))}
          </div>

          <div className="voting-actions">
            <button
              className="confirm-vote-btn"
              onClick={handleVote}
              disabled={!selectedCandidate || loading}
            >
              {selectedCandidate ? "Confirm Your Vote" : "Select a Candidate"}
              <span className="btn-icon">🗳️</span>
            </button>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div
          className="modal-overlay"
          onClick={() => !loading && setShowConfirmation(false)}
        >
          <div
            className="confirmation-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-icon">⚠️</div>
            <h2>Confirm Your Vote</h2>
            <p>Are you sure you want to vote for:</p>
            <div className="selected-candidate-preview">
              <span className="preview-avatar">
                {
                  election.candidates?.find((c) => c._id === selectedCandidate)
                    ?.image
                }
              </span>
              <div>
                <h3>
                  {
                    election.candidates?.find(
                      (c) => c._id === selectedCandidate
                    )?.name
                  }
                </h3>
                <p>
                  {
                    election.candidates?.find(
                      (c) => c._id === selectedCandidate
                    )?.party
                  }
                </p>
              </div>
            </div>
            <p className="warning-text">⚠️ This action cannot be undone!</p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowConfirmation(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="proceed-btn"
                onClick={confirmVote}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Voting...
                  </>
                ) : (
                  "Yes, Cast My Vote"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionPage;
