import { Router } from "express";
import { createBlog, deleteBlog, editBlog, getAllBlogs, getBlogBySlug, getBlogForEdit, getBlogs, uploadBlogImage } from "../service/Blog.service.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { upload } from "../middleware/multer.js";

export const BlogRouter = Router();

BlogRouter.get("/blogs", getBlogs);
BlogRouter.get("/blog/:slug", getBlogBySlug);
BlogRouter.post("/create-blog", verifyJWT, upload.single("coverImage"), createBlog);
BlogRouter.put("/edit-blog/:id", verifyJWT, upload.single("coverImage"), editBlog);
BlogRouter.delete("/delete-blog/:id", verifyJWT, deleteBlog);
BlogRouter.get("/edit-blog/:slug", verifyJWT, getBlogForEdit);
BlogRouter.get("/all-blogs", verifyJWT, getAllBlogs);
BlogRouter.post("/upload-image", verifyJWT, upload.single("image"), uploadBlogImage);