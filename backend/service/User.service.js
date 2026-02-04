import { User } from "../models/User.model.js"
import { ApiResponse } from "../utils/Response.js";

export const registerUser = async (req,res) =>{
    // register the user
    try {
        const { username, name, position, password } = req.body;
        
        if([username, name, position, password].some(field => field?.trim() === "")){
            return ApiResponse(res, 400, false, "All fields are required");
        }
        const existingUser = await User.findOne({
            username: username.trim()
        })
    
        if(existingUser){
            return ApiResponse(res, 409, false, "Username is already taken");
        }
    
        const user = await User.create({
            username: username,
            name: name,
            position: position,
            password: password
        })
    
        return ApiResponse(res, 201, true, "User registered successfully", {
            user: {
                _id: user._id,
                username: user.username,
                name: user.name,
                position: user.position
            }
        })
    } catch (error) {
        return ApiResponse(res, 500, false, "Error registering user", { error: error.message });
    }
}

export const loginUser = async (req,res) =>{
    const { username, password } = req.body;
    try {
        if([username, password].some(field => !field.trim() === "")){
            return ApiResponse(res, 400, false, "All fields are required");
        }
        const user = await User.findOne({
            username: username
        })

        if(!user) {
            return ApiResponse(res, 404, false, "User not found");
        }
        const isPasswordValid = await user.isPasswordCorrect(password);
        
        if(!isPasswordValid) {
            return ApiResponse(res, 401, false, "Invalid password");
        }
        
        const token = user.generateAccessToken();

        return ApiResponse(res, 200, true, "User logged in successfully", {
            token,
            user: {
                _id: user._id,
                username: user.username,
                name: user.name,
                position: user.position
            }
        })
    } catch (error) {
        return ApiResponse(res, 500, false, "Error logging in user", { error: error.message });
    }
}

export const getUserProfile = async (req, res) => {
    return ApiResponse(
        res, 
        200, 
        true, 
        "User profile fetched successfully", 
        req.user
    );
}

export const updateUserProfile = async (req, res) => {
    try {
        const { name, position, username } = req.body;
        if (username && username !== req.user.username) {
            const formattedUsername = username
            const existedUser = await User.findOne({ username: formattedUsername });
            if (existedUser) {
                return ApiResponse(res, 409, false, "This username is already taken by another user");
            }
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    name: name || req.user.name,
                    position: position || req.user.position,
                    username: username ? username : req.user.username
                }
            },
            { new: true, runValidators: true }
        ).select("-password");

        const newToken = updatedUser.generateAccessToken();

        return ApiResponse(res, 200, true, "Profile updated successfully", { 
            user: updatedUser,
            token: newToken
        });

    } catch (error) {
        return ApiResponse(res, 500, false, "Error updating user profile", { error: error.message });
    }
}

export const deleteUserAccount = async (req,res) =>{
    try {
        await User.findByIdAndDelete(req.user?._id);
        return ApiResponse(res, 200, true, "User account deleted successfully");
    } catch (error) {
        return ApiResponse(res, 500, false, "Error deleting user account", { error: error.message });
    }
}
