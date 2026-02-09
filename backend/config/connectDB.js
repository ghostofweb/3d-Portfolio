import mongoose from "mongoose";

let isConnected = false; // Track the connection

const connectDB = async () => {
    mongoose.set("strictQuery", true);

    // If already connected, use existing connection (Warm Start)
    if (isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "blog",
            bufferCommands: false, // Disable buffering for faster fail/success
        });

        isConnected = db.connections[0].readyState;
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
    }
};

export default connectDB;