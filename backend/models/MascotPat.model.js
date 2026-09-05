import mongoose from "mongoose";

const MascotPatSchema = new mongoose.Schema(
    {
        visitorId: { type: String, required: true, unique: true, index: true },
    },
    { timestamps: true }
);

export const MascotPat = mongoose.models.MascotPat || mongoose.model("MascotPat", MascotPatSchema);
