import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MongoDB URI is not defined in environment variables");
        }
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/blog`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);

    } catch (error) {
        console.error("MONGODB connection FAILED ", error);
        process.exit(1);
    }
}

export default connectDB;