import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socketService from "../utils/socket";
import "./ResultsPage.css";

const ResultsPage = ({ elections }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);

  useEffect(() => {
    const currentElection = elections.find((e) => e._id === id);
    setElection(currentElection);

    // Join this election for real-time updates
    if (currentElection) {
      socketService.joinElection(currentElection._id);
    }
  }, [id, elections]);

  if (!election) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading results...</p>
      </div>
    );
  }

  const totalVotes = election.totalVotes || 0;
  const sortedCandidates = [...(election.candidates || [])].sort(
    (a, b) => (b.votes || 0) - (a.votes || 0)
  );
  const winner = sortedCandidates[0];

  return (
    <div className="results-page">
      {/* Header */}
      <header className="results-header">
        <button className="back-btn" onClick={() => navigate("/main")}>
          ← Back to Main
        </button>
        <div className="results-title-section">
          <span className="results-icon">{election.icon}</span>
          <h1>{election.title}</h1>
          <p className="live-badge">
            <span className="pulse-dot"></span>
            Live Results
          </p>
        </div>
      </header>

      {/* Winner Section */}
      {winner && (
        <section className="winner-section">
          <div className="winner-card">
            <div className="trophy-icon">🏆</div>
            <h2>Current Leader</h2>
            <div className="winner-info">
              <span className="winner-avatar">{winner.image}</span>
              <h3>{winner.name}</h3>
              <p>{winner.party}</p>
              <div className="winner-stats">
                <span className="winner-votes">
                  {(winner.votes || 0).toLocaleString()} votes
                </span>
                <span className="winner-percentage">
                  {totalVotes > 0
                    ? (((winner.votes || 0) / totalVotes) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      <section className="results-section">
        <div className="results-container">
          <div className="results-header-info">
            <h2>Detailed Results</h2>
            <div className="total-votes-badge">
              📊 Total Votes: {totalVotes.toLocaleString()}
            </div>
          </div>

          <div className="results-list">
            {sortedCandidates.map((candidate, index) => {
              const percentage =
                totalVotes > 0
                  ? (((candidate.votes || 0) / totalVotes) * 100).toFixed(1)
                  : 0;

              return (
                <div key={candidate._id} className="result-item">
                  <div className="result-rank">#{index + 1}</div>
                  <div className="result-content">
                    <div className="result-header">
                      <div className="result-candidate">
                        <span className="result-avatar">{candidate.image}</span>
                        <div className="result-details">
                          <h3>{candidate.name}</h3>
                          <p>{candidate.party}</p>
                        </div>
                      </div>
                      <div className="result-stats">
                        <span className="result-votes">
                          {(candidate.votes || 0).toLocaleString()}
                        </span>
                        <span className="result-percentage">{percentage}%</span>
                      </div>
                    </div>
                    <div className="result-progress">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${percentage}%`,
                          background: candidate.color,
                        }}
                      >
                        <div className="progress-shine"></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart Visualization */}
          <div className="chart-section">
            <h3>Vote Distribution</h3>
            <div className="pie-chart-container">
              {sortedCandidates.map((candidate) => {
                const percentage =
                  totalVotes > 0
                    ? (((candidate.votes || 0) / totalVotes) * 100).toFixed(1)
                    : 0;
                return (
                  <div key={candidate._id} className="chart-bar">
                    <div className="chart-label">
                      <span>{candidate.image}</span>
                      <span className="chart-name">{candidate.name}</span>
                    </div>
                    <div className="chart-bar-bg">
                      <div
                        className="chart-bar-fill"
                        style={{
                          width: `${percentage}%`,
                          background: candidate.color,
                        }}
                      />
                    </div>
                    <span className="chart-percentage">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResultsPage;
