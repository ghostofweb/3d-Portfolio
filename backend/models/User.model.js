import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true, 
        index: true,
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        index: true
    },
    position: {
        type: String,
        required: [true, "Position is required"],
        trim: true,
    },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
    timestamps: true 
});


UserSchema.pre("save", async function () { 
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};
UserSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            position: this.position
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};
UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};
export const User = mongoose.models.User || mongoose.model("User", UserSchema);