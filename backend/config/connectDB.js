import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  try {
    if (isConnected) {
      return;
    }

    if (!process.env.MONGODB_URI) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/blog`,
      {
        bufferCommands: false
      }
    );

    isConnected = true;

    console.log(
      "MongoDB connected !! DB HOST:",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.error("MONGODB connection FAILED:", error.message);

    // ❌ DO NOT EXIT PROCESS ON SERVERLESS
    throw error;
  }
};

export default connectDB;
