import express from "express";
import { protectRoute } from "../middlewares/auth.js";
import {
  getUserForSidebar,
  getMessages,
  markMessagesAsSeen,
  sendMessage,
} from "../controllers/messageControler.js";
const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUserForSidebar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("/mark/:id", protectRoute, markMessagesAsSeen);

messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;
