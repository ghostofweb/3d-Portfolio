import { OTP } from "../models/OTP.model.js";
import { User } from "../models/User.model.js"
import { ApiResponse } from "../utils/Response.js";

export const registerUser = async (req, res) => {
    try {
        // ✅ Now accepting 'email' and 'otp'
        const { username, name, position, password, email, otp } = req.body;
        
        if ([username, name, position, password, email, otp].some(field => field?.trim() === "")) {
            return ApiResponse(res, 400, false, "All fields (including OTP) are required");
        }

        // 🔍 VERIFY OTP
        // Find the most recent OTP for this email
        const recentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });

        if (!recentOTP || recentOTP.otp !== otp) {
            return ApiResponse(res, 400, false, "Invalid or expired OTP");
        }

        // Check for existing user (Username or Email)
        const existingUser = await User.findOne({ 
            $or: [{ username }, { email }] 
        });
    
        if (existingUser) {
            return ApiResponse(res, 409, false, "Username or Email is already taken");
        }
    
        // Create User
        const user = await User.create({
            username,
            name,
            position,
            password,
            email // ✅ Save email
        });
    
        return ApiResponse(res, 201, true, "User registered successfully", {
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
                position: user.position
            }
        });
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

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password").sort({ createdAt: -1 });
        
        return ApiResponse(res, 200, true, "Team members fetched successfully", users);
    } catch (error) {
        return ApiResponse(res, 500, false, error.message);
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

export const removeMember = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Find the user being deleted
        const userToDelete = await User.findById(id);

        if (!userToDelete) {
            return ApiResponse(res, 404, false, "User not found");
        }
        if (userToDelete.username === "ghostofweb") {
            return ApiResponse(res, 403, false, "⚠️ ACCESS DENIED: The Master Admin cannot be removed.");
        }

        await User.findByIdAndDelete(id);

        return ApiResponse(res, 200, true, "Team member removed successfully");
    } catch (error) {
        return ApiResponse(res, 500, false, error.message);
    }
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

export const forgotPassword = async (req, res) => {
    try {
        const { username } = req.body; // Asking for username since email isn't in your schema yet?
        
        // NOTE: Usually we reset via Email. If you don't have an email field, 
        // you must add it to the Schema first or ask for it in the body.
        // For this example, I'll assume you pass 'email' in the body even if not in schema, 
        // OR you should add `email: { type: String }` to your User Model.
        
        // Let's assume we find by Username, but we need an email to send to.
        // If your User model DOES NOT have an email field, this won't work.
        // --> CRITICAL: You MUST add `email` to UserSchema for this to work properly.
        
        const user = await User.findOne({ username });

        if (!user) {
            return ApiResponse(res, 404, false, "User not found");
        }

        // Generate Token
        const resetToken = user.getResetPasswordToken();

        // Save only the new fields (turn off validation to prevent errors on other fields)
        await user.save({ validateBeforeSave: false });

        // Create Reset URL (Frontend URL)
        // Adjust 'http://localhost:5173' to your actual frontend URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const message = `
            You have requested a password reset. 
            Please make a PUT request to the following link:
            \n\n${resetUrl}\n\n
            This link allows you to reset your password within 10 minutes.
        `;

        try {
            // NOTE: user.email must exist!
            // If you haven't added email to schema, pass it explicitly in req.body for now: req.body.email
            await sendEmail({
                email: req.body.email || user.email, 
                subject: "Password Reset Request",
                message
            });

            return ApiResponse(res, 200, true, "Email sent successfully");

        } catch (error) {
            // If email fails, clear the token so user can retry
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return ApiResponse(res, 500, false, "Email could not be sent", error.message);
        }

    } catch (error) {
        return ApiResponse(res, 500, false, error.message);
    }
};

export const resetPassword = async (req, res) => {
    try {
        // Get token from URL params
        const { token } = req.params;
        const { password } = req.body;

        // Hash the token (to match what is in DB)
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find user with matching token AND valid expiration
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() } // $gt means Greater Than now
        });

        if (!user) {
            return ApiResponse(res, 400, false, "Invalid or expired token");
        }

        // Set new password (the pre-save hook will hash it automatically)
        user.password = password;
        
        // Clear reset fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return ApiResponse(res, 200, true, "Password updated successfully");

    } catch (error) {
        return ApiResponse(res, 500, false, error.message);
    }
};

export const sendRegistrationOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return ApiResponse(res, 400, false, "Email is required");
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return ApiResponse(res, 409, false, "Email is already registered");
        }

        // Generate 6-digit numeric OTP
        // Using crypto to get a random number between 100000 and 999999
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Create OTP Document (This triggers the pre-save hook to send email)
        await OTP.create({ email, otp });

        return ApiResponse(res, 200, true, "OTP sent successfully to your email");

    } catch (error) {
        console.error("OTP Error:", error);
        return ApiResponse(res, 500, false, "Failed to send OTP", error.message);
    }
};
