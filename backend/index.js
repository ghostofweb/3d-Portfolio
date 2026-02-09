import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js'; 
import { BlogRouter } from './router/Blog.route.js';
import { UserRouter } from './router/User.route.js';

dotenv.config();

const app = express();


app.use(
  cors({
    origin: ["https://ghostofweb.vercel.app", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(helmet());
app.use(express.json({ limit: '50mb' })); 


if (process.env.NODE_ENV !== 'production') {
    app.use(morgan("dev"));
}


app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({ error: "Service unavailable" });
    }
});


app.get("/", (req, res) => {
    res.setHeader('Cache-Control', 's-maxage=86400');
    res.send("GhostOfWeb Backend is Active 🚀");
});


app.use("/api/blog", BlogRouter);
app.use("/api/user", UserRouter);


if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running locally on port ${PORT}`);
    });
}

export default app;