const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load env variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Import routes
const authRoutes = require("./routes/auth");
const electionRoutes = require("./routes/elections");
const voteRoutes = require("./routes/votes");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/votes", voteRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "🗳️ Bangladesh Voting App API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      elections: "/api/elections",
      votes: "/api/votes",
    },
  });
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  socket.on("joinElection", (electionId) => {
    socket.join(electionId);
    console.log(`User ${socket.id} joined election: ${electionId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`
  🚀 Server is running on port ${PORT}
  📊 Environment: ${process.env.NODE_ENV}
  🗄️  Database: MongoDB
  🔌 Socket.IO: Enabled
  `);
});
