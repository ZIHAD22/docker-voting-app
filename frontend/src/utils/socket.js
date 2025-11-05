import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket.id);
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  joinElection(electionId) {
    if (this.socket) {
      this.socket.emit("joinElection", electionId);
    }
  }

  onVoteUpdate(callback) {
    if (this.socket) {
      this.socket.on("voteUpdate", callback);
    }
  }

  offVoteUpdate() {
    if (this.socket) {
      this.socket.off("voteUpdate");
    }
  }
}

export default new SocketService();
