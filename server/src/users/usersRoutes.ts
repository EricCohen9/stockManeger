import express from "express";
import {
  registerController,
  loginController,
  deleteUserByUserId,
  forgotPassword,
  resetPassword,
  getAllUsersController,
  comperepassword,
} from "./userController";
import { validateUser } from "../validation/validation";
import { limiter } from "../rateLimiter/rateLimiter";
import { verifyToken } from "../jwt/jwt";
import cors from "cors";
import { corsConfigs } from "../config/corsConfigs";
export const userRouter = express.Router();

userRouter.get("/", verifyToken, getAllUsersController);
userRouter.post("/register", validateUser, registerController);
userRouter.post("/login", limiter, validateUser, loginController);
userRouter.post("/forgotpassword", forgotPassword);
userRouter.post("/comparepassword", comperepassword);
userRouter.post("/resetpaasword", resetPassword);
userRouter.delete("/:userId", deleteUserByUserId);
export default userRouter;
