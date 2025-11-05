import React from "react";
import VoteOption from "./VoteOption";
import "../styles/Pollcard.css";

const PollCard = ({ poll, onVote, totalVotes }) => {
  const hasVoted = poll.userVoted !== null;

  return (
    <div className="poll-card">
      <div className="poll-question">
        <h2>{poll.question}</h2>
        <div className="total-votes">
          {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
        </div>
      </div>

      <div className="poll-options">
        {poll.options.map((option) => (
          <VoteOption
            key={option.id}
            option={option}
            totalVotes={totalVotes}
            hasVoted={hasVoted}
            isUserChoice={poll.userVoted === option.id}
            onVote={() => onVote(poll.id, option.id)}
          />
        ))}
      </div>

      {hasVoted && (
        <div className="vote-confirmation">
          <span className="check-icon">✓</span>
          Thanks for voting!
        </div>
      )}
    </div>
  );
};

export default PollCard;
