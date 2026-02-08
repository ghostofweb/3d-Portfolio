import { Router } from "express";
import { deleteUserAccount, forgotPassword, getAllUsers, getUserProfile, loginUser, registerUser, removeMember, resetPassword, resetPasswordWithOTP, sendCurrentUserOTP, sendPasswordResetOTP, sendRegistrationOTP, updateUserProfile } from "../service/User.service.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

export const UserRouter = Router();

UserRouter.post("/register", registerUser);
UserRouter.post("/login", loginUser);
UserRouter.get("/profile",verifyJWT, getUserProfile);
UserRouter.put("/update-profile",verifyJWT, updateUserProfile);
UserRouter.delete("/delete-account",verifyJWT, deleteUserAccount);
UserRouter.get("/all-users", verifyJWT, getAllUsers);
UserRouter.delete("/remove-member/:id", verifyJWT, removeMember);
UserRouter.post("/forgot-password-otp", sendPasswordResetOTP);
UserRouter.post("/reset-password-otp", resetPasswordWithOTP);
UserRouter.post("/send-current-user-otp", verifyJWT, sendCurrentUserOTP);
UserRouter.post("/forgot-password", forgotPassword);
UserRouter.put("/reset-password/:token", resetPassword);
UserRouter.post("/send-otp", sendRegistrationOTP);