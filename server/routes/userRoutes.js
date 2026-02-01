import express from "express";
const userRouter = express.Router();
import {
  signup,
  login,
  updateProfile,
  checkAuth,
} from "../controllers/userController.js";
import { protectRoute } from "../middlewares/auth.js";

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/update-Profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkAuth);

export default userRouter;
