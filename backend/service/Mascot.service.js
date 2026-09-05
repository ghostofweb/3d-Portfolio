import { MascotPat } from "../models/MascotPat.model.js";
import { ApiResponse } from "../utils/Response.js";

export const patDog = async (req, res) => {
    try {
        const { visitorId } = req.body;
        if (!visitorId || typeof visitorId !== "string") {
            return ApiResponse(res, 400, false, "visitorId is required");
        }

        try {
            await MascotPat.create({ visitorId });
        } catch (error) {
            // duplicate key (E11000) just means this visitor already patted once — ignore
            if (error.code !== 11000) throw error;
        }

        const count = await MascotPat.countDocuments();
        return ApiResponse(res, 200, true, "Pat recorded", { count });
    } catch (error) {
        return ApiResponse(res, 500, false, error.message || "Failed to record pat");
    }
};

export const getPatCount = async (req, res) => {
    try {
        const count = await MascotPat.countDocuments();
        return ApiResponse(res, 200, true, "Pat count fetched", { count });
    } catch (error) {
        return ApiResponse(res, 500, false, error.message || "Failed to fetch pat count");
    }
};
