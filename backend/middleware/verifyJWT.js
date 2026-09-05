import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized request: No token provided" 
            });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password");
        console.log("Authenticated User Email:", user.email);
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid Access Token: User not found" 
            });
        }
        req.user = user;
        next();
        
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: error?.message || "Invalid Access Token" 
        });
    }
};