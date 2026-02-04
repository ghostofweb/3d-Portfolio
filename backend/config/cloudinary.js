import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_NAME, 
            api_key: process.env.CLOUDINARY_KEY, 
            api_secret: process.env.CLOUDINARY_SECRET_API
        });

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "portfolio_blogs"
        });
        
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        console.error("❌ Cloudinary Error:", error.message);
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return null;
    }
};

export { uploadOnCloudinary };