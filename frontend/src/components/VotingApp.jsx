import React, { useState, useEffect } from "react";
import PollCard from "./Pollcard";
import "../styles/VotingApp.css";

const VotingApp = () => {
  const [polls, setPolls] = useState([
    {
      id: 1,
      question: "What's your favorite programming language?",
      options: [
        { id: 1, text: "JavaScript", votes: 45, emoji: "🟨" },
        { id: 2, text: "Python", votes: 38, emoji: "🐍" },
        { id: 3, text: "Java", votes: 22, emoji: "☕" },
        { id: 4, text: "TypeScript", votes: 31, emoji: "🔷" },
      ],
      userVoted: null,
    },
    {
      id: 2,
      question: "Best time to code?",
      options: [
        { id: 1, text: "Morning", votes: 25, emoji: "🌅" },
        { id: 2, text: "Afternoon", votes: 18, emoji: "☀️" },
        { id: 3, text: "Evening", votes: 42, emoji: "🌆" },
        { id: 4, text: "Night", votes: 67, emoji: "🌙" },
      ],
      userVoted: null,
    },
  ]);

  const [activePoll, setActivePoll] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  // Simulate real-time updates (replace with actual WebSocket/Socket.IO)
  useEffect(() => {
    const interval = setInterval(() => {
      setPolls((prevPolls) =>
        prevPolls.map((poll) => ({
          ...poll,
          options: poll.options.map((option) => ({
            ...option,
            votes: option.votes + Math.floor(Math.random() * 3),
          })),
        }))
      );

      setIsUpdating(true);
      setTimeout(() => setIsUpdating(false), 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleVote = (pollId, optionId) => {
    setPolls((prevPolls) =>
      prevPolls.map((poll) => {
        if (poll.id === pollId && poll.userVoted === null) {
          return {
            ...poll,
            userVoted: optionId,
            options: poll.options.map((option) => ({
              ...option,
              votes: option.id === optionId ? option.votes + 1 : option.votes,
            })),
          };
        }
        return poll;
      })
    );
  };

  const getTotalVotes = (options) => {
    return options.reduce((sum, option) => sum + option.votes, 0);
  };

  return (
    <div className="voting-app">
      {/* Header */}
      <div className="app-header">
        <h1 className="app-title">
          <span className="title-icon">📊</span>
          Live Polls
        </h1>
        <p className="app-subtitle">
          Vote in real-time and see results instantly
        </p>
        {isUpdating && (
          <div className="live-indicator">
            <span className="pulse-dot"></span>
            <span>Live</span>
          </div>
        )}
      </div>

      {/* Poll Navigation */}
      <div className="poll-navigation">
        {polls.map((poll, index) => (
          <button
            key={poll.id}
            className={`nav-dot ${activePoll === index ? "active" : ""}`}
            onClick={() => setActivePoll(index)}
            aria-label={`Poll ${index + 1}`}
          />
        ))}
      </div>

      {/* Active Poll */}
      <div className="poll-container">
        <PollCard
          poll={polls[activePoll]}
          onVote={handleVote}
          totalVotes={getTotalVotes(polls[activePoll].options)}
        />
      </div>

      {/* Poll Counter */}
      <div className="poll-counter">
        Poll {activePoll + 1} of {polls.length}
      </div>

      {/* Navigation Arrows */}
      <div className="arrow-navigation">
        <button
          className="nav-arrow left"
          onClick={() => setActivePoll((prev) => Math.max(0, prev - 1))}
          disabled={activePoll === 0}
        >
          ←
        </button>
        <button
          className="nav-arrow right"
          onClick={() =>
            setActivePoll((prev) => Math.min(polls.length - 1, prev + 1))
          }
          disabled={activePoll === polls.length - 1}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default VotingApp;
