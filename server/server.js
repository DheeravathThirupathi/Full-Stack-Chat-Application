import express from "express";
import http from "http";
import cors from "cors";
import "dotenv/config";

import connectDB from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRouter.js";
import { Server } from "socket.io";

//create express app
const app = express();
const server = http.createServer(app);

//create socket io server
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// store online users
export const userSocketMap = {};

//socket connection
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
  const userId = socket.handshake.query.userId;
  console.log("User connected with ID:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("Client disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

//----------- middlewares----------
app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => {
  res.send({ status: "Server is running" });
});

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

//connect to DataBase
await connectDB();
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5001;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
//export server for vercel deployment
export default server;
