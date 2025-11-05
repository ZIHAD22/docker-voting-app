import React from "react";
import "../styles/VoteOption.css";

const VoteOption = ({ option, totalVotes, hasVoted, isUserChoice, onVote }) => {
  const percentage =
    totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0;

  return (
    <div
      className={`vote-option ${hasVoted ? "voted" : ""} ${
        isUserChoice ? "user-choice" : ""
      }`}
      onClick={!hasVoted ? onVote : undefined}
    >
      <div className="option-content">
        <span className="option-emoji">{option.emoji}</span>
        <span className="option-text">{option.text}</span>
        {hasVoted && (
          <>
            <span className="option-percentage">{percentage}%</span>
            <span className="option-votes">{option.votes}</span>
          </>
        )}
        {isUserChoice && <span className="your-vote-badge">Your vote</span>}
      </div>

      {hasVoted && (
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${percentage}%` }}>
            <div className="progress-shine"></div>
          </div>
        </div>
      )}

      {!hasVoted && (
        <div className="vote-hover-effect">
          <span>Click to vote</span>
        </div>
      )}
    </div>
  );
};

export default VoteOption;
