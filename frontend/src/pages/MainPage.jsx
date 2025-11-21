import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socketService from "../utils/socket";
import "./MainPage.css";

const MainPage = ({ user, elections, onLogout, loading, error }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Join all active elections for real-time updates
    elections.forEach((election) => {
      socketService.joinElection(election._id);
    });
  }, [elections]);

  const filteredElections =
    filter === "all" ? elections : elections.filter((e) => e.type === filter);

  const hasVoted = (electionId) => {
    return user.votedElections?.includes(electionId);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading elections...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-card">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-page">
      {/* Header */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo">
            <div className="bd-flag-mini">
              <div className="flag-circle-mini"></div>
            </div>
            <h1>🗳️ BD Voting2.0 </h1>
          </div>
          <div className="user-info">
            <div className="user-avatar">
              {user.isAnonymous ? "👤" : user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* Welcome Section */}
          <div className="welcome-section">
            <h2>
              Welcome, {user.isAnonymous ? "Voter" : user.name.split(" ")[0]}!
              👋
            </h2>
            <p>Select an election or poll below to cast your vote</p>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All ({elections.length})
            </button>
            <button
              className={`filter-tab ${filter === "election" ? "active" : ""}`}
              onClick={() => setFilter("election")}
            >
              Elections ({elections.filter((e) => e.type === "election").length}
              )
            </button>
            <button
              className={`filter-tab ${filter === "poll" ? "active" : ""}`}
              onClick={() => setFilter("poll")}
            >
              Polls ({elections.filter((e) => e.type === "poll").length})
            </button>
          </div>

          {/* Elections Grid */}
          {filteredElections.length === 0 ? (
            <div className="no-elections">
              <h3>
                📭 No {filter !== "all" ? filter + "s" : "elections"} available
              </h3>
              <p>Check back later for new voting opportunities</p>
            </div>
          ) : (
            <div className="elections-grid">
              {filteredElections.map((election) => {
                const voted = hasVoted(election._id);
                const totalVotes = election.totalVotes || 0;

                return (
                  <div
                    key={election._id}
                    className={`election-card ${voted ? "voted" : ""}`}
                  >
                    <div className="election-header">
                      <span className="election-icon">{election.icon}</span>
                      <span className={`election-badge ${election.type}`}>
                        {election.type === "election"
                          ? "🗳️ Election"
                          : "📊 Poll"}
                      </span>
                    </div>

                    <h3>{election.title}</h3>
                    <p className="election-description">
                      {election.description}
                    </p>

                    <div className="election-stats">
                      <div className="stat">
                        <span className="stat-value">
                          {election.candidates?.length || 0}
                        </span>
                        <span className="stat-label">Candidates</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">
                          {totalVotes.toLocaleString()}
                        </span>
                        <span className="stat-label">Votes</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{election.status}</span>
                        <span className="stat-label">Status</span>
                      </div>
                    </div>

                    <div className="election-actions">
                      {voted ? (
                        <>
                          <button className="voted-btn" disabled>
                            <span className="check-icon">✓</span>
                            You Voted
                          </button>
                          <button
                            className="results-btn"
                            onClick={() => navigate(`/results/${election._id}`)}
                          >
                            View Results
                          </button>
                        </>
                      ) : (
                        <button
                          className="vote-btn"
                          onClick={() => navigate(`/election/${election._id}`)}
                        >
                          Cast Your Vote
                          <span className="arrow">→</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Live Updates Indicator */}
      <div className="live-updates">
        <span className="pulse-dot"></span>
        <span>Live Updates</span>
      </div>
    </div>
  );
};

export default MainPage;
