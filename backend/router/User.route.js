import { Router } from "express";
import { deleteUserAccount, getUserProfile, loginUser, registerUser, updateUserProfile } from "../service/User.service.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

export const UserRouter = Router();

UserRouter.post("/register", registerUser);
UserRouter.post("/login", loginUser);
UserRouter.get("/profile",verifyJWT, getUserProfile);
UserRouter.put("/update-profile",verifyJWT, updateUserProfile);
UserRouter.delete("/delete-account",verifyJWT, deleteUserAccount);

