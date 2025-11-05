import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RegistrationPage from "../pages/RegistrationPage";
import MainPage from "../pages/MainPage";
import ElectionPage from "../pages/ElectionPage";
import ResultsPage from "../pages/ResultsPage";
import { electionsAPI } from "../utils/api";
import socketService from "../utils/socket";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem("voter_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Connect socket
    socketService.connect();

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  useEffect(() => {
    // Fetch elections from backend
    const fetchElections = async () => {
      try {
        setLoading(true);
        const response = await electionsAPI.getAll();
        setElections(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching elections:", err);
        setError("Failed to load elections. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchElections();

    // Listen for real-time vote updates
    socketService.onVoteUpdate((data) => {
      console.log("Vote update received:", data);
      setElections((prevElections) =>
        prevElections.map((election) => {
          if (election._id === data.electionId) {
            return {
              ...election,
              totalVotes: data.totalVotes,
              candidates: election.candidates.map((candidate) => {
                if (candidate._id === data.candidateId) {
                  return { ...candidate, votes: data.votes };
                }
                return candidate;
              }),
            };
          }
          return election;
        })
      );
    });

    // Cleanup socket listener
    return () => {
      socketService.offVoteUpdate();
    };
  }, []);

  const handleRegister = (userData) => {
    const userWithVotedElections = {
      ...userData,
      votedElections: userData.votedElections || [],
    };
    setUser(userWithVotedElections);
    localStorage.setItem("voter_user", JSON.stringify(userWithVotedElections));
  };

  const handleVote = async (electionId, candidateId) => {
    // Update local state immediately for better UX
    const updatedElections = elections.map((election) => {
      if (election._id === electionId) {
        return {
          ...election,
          totalVotes: (election.totalVotes || 0) + 1,
          candidates: election.candidates.map((candidate) => ({
            ...candidate,
            votes:
              candidate._id === candidateId
                ? (candidate.votes || 0) + 1
                : candidate.votes,
          })),
        };
      }
      return election;
    });

    setElections(updatedElections);

    // Update user's voted elections
    const updatedUser = {
      ...user,
      votedElections: [...(user.votedElections || []), electionId],
    };
    setUser(updatedUser);
    localStorage.setItem("voter_user", JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("voter_user");
  };

  if (loading && !user) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/main" />
              ) : (
                <RegistrationPage onRegister={handleRegister} />
              )
            }
          />
          <Route
            path="/main"
            element={
              user ? (
                <MainPage
                  user={user}
                  elections={elections}
                  onLogout={handleLogout}
                  loading={loading}
                  error={error}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/election/:id"
            element={
              user ? (
                <ElectionPage
                  user={user}
                  elections={elections}
                  onVote={handleVote}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/results/:id"
            element={<ResultsPage elections={elections} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
