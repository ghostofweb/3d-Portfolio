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

connectDB();
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Hello World from Express server!");
})

app.use("/api/blog",BlogRouter);
app.use("/api/user", UserRouter);
app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})