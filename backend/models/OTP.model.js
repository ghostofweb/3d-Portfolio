import mongoose from "mongoose";
import sendEmail from "../utils/sendEmail.js";

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300,
    }
});

// hook to send email before saving
OTPSchema.pre("save", async function(next) {
    if (this.isNew) {
        await sendEmail({
            email: this.email,
            subject: "Verification Code - GhostOfWeb",
            message: `Your verification code is: ${this.otp}. It expires in 5 minutes.`
        });
    }
});

export const OTP = mongoose.model("OTP", OTPSchema);