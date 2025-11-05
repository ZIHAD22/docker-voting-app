import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("voter_user") || "{}");
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/profile"),
};

// Elections API
export const electionsAPI = {
  getAll: () => api.get("/elections"),
  getById: (id) => api.get(`/elections/${id}`),
  getResults: (id) => api.get(`/elections/${id}/results`),
  create: (electionData) => api.post("/elections", electionData),
};

// Votes API
export const votesAPI = {
  castVote: (voteData) => api.post("/votes", voteData),
  getMyVotes: () => api.get("/votes/my-votes"),
  checkVote: (electionId) => api.get(`/votes/check/${electionId}`),
};

export default api;
