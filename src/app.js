require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./DBConfig");
const Router = require("./Router");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use('/api', Router);

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (change this for production)
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendNews", (news) => {
    io.emit("receiveNews", news); // Broadcast news to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
connectDB.then(() => {
  server.listen(PORT, () => {
    console.log(`Server started running on port: ${PORT}`);
  });
});

