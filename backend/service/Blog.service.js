import { uploadOnCloudinary } from "../config/cloudinary.js";
import { Blog } from "../models/Blog.model.js";
import { ApiResponse } from "../utils/Response.js";

export const createBlog = async (req, res) => {
    try {
        console.log("--------- START CREATE BLOG ---------");
        console.log("1. Received Body:", req.body);
        console.log("2. Received File:", req.file);

        const { title, slug, content, tags } = req.body;

        if (!title || !content) {
            console.log("❌ Validation Failed: Title or Content missing");
            return ApiResponse(res, 400, false, "Title and Content are required");
        }

        let coverImageUrl = "";
        
        if (req.file) {
            console.log("3. File detected, attempting upload to Cloudinary...");
            const uploadedImage = await uploadOnCloudinary(req.file.path);
            
            if (uploadedImage) {
                coverImageUrl = uploadedImage.url;
                console.log("✅ Cloudinary Upload Success. URL:", coverImageUrl);
            } else {
                console.error("❌ Cloudinary Upload Failed: Response was null");
            }
        } else {
            console.log("⚠️ No file received in req.file. Skipping image upload.");
        }

        const blog = await Blog.create({
            title,
            slug: slug || title.toLowerCase().replace(/ /g, '-'),
            content,
            tags: tags ? (typeof tags === "string" ? tags.split(",") : tags) : [],
            coverImage: coverImageUrl,
            author: req.user._id,
            isPublished: true 
        });

        console.log("✅ Blog Saved to DB:", blog._id);
        console.log("--------- END CREATE BLOG ---------");

        return ApiResponse(res, 201, true, "Blog created successfully", blog);

    } catch (error) {
        console.error("❌ CRITICAL ERROR in createBlog:", error);
        return ApiResponse(res, 500, false, error.message);
    }
}

export const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true })
            .populate("author", "name username position")
            .sort({ createdAt: -1 });

        return ApiResponse(res, 200, true, "Blogs fetched successfully", blogs);
    } catch (error) {
        return ApiResponse(res, 500, false, error.message);
    }
}

export const getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const blog = await Blog.findOneAndUpdate(
            { slug, isPublished: true },
            { $inc: { views: 1 } }, 
            { new: true }
        ).populate("author", "name username position");

        if (!blog) {
            return ApiResponse(res, 404, false, "Blog not found");
        }

        return ApiResponse(res, 200, true, "Blog fetched successfully", blog);
    } catch (error) {
        return ApiResponse(res, 500, false, error.message);
    }
}

export const editBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, tags, isPublished } = req.body;

        const blog = await Blog.findById(id);

        if (!blog) {
            return ApiResponse(res, 404, false, "Blog not found");
        }

        if (blog.author.toString() !== req.user._id.toString()) {
            return ApiResponse(res, 403, false, "You are not authorized to edit this blog");
        }

        let coverImageUrl = blog.coverImage;
        if (req.file) {
            const uploadedImage = await uploadOnCloudinary(req.file.path);
            if (uploadedImage) {
                coverImageUrl = uploadedImage.url;
            }
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.tags = tags ? (typeof tags === "string" ? tags.split(",") : tags) : blog.tags;
        blog.isPublished = isPublished !== undefined ? isPublished : blog.isPublished;
        blog.coverImage = coverImageUrl;

        await blog.save();

        return ApiResponse(res, 200, true, "Blog updated successfully", blog);

    } catch (error) {
        return ApiResponse(res, 500, false, error.message);
    }
}

export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id);

        if (!blog) {
            return ApiResponse(res, 404, false, "Blog not found");
        }

        if (blog.author.toString() !== req.user._id.toString()) {
            return ApiResponse(res, 403, false, "You are not authorized to delete this blog");
        }

        await Blog.findByIdAndDelete(id);

        return ApiResponse(res, 200, true, "Blog deleted successfully");

    } catch (error) {
        return ApiResponse(res, 500, false, error.message);
    }
}

export const getBlogForEdit = async (req, res) => {
    try {
        const { slug } = req.params;

        // Find by slug, BUT do not filter by isPublished (so we can edit drafts)
        // And do NOT increment views
        const blog = await Blog.findOne({ slug }).populate("author", "name username");

        if (!blog) {
            return ApiResponse(res, 404, false, "Blog not found");
        }

        // Optional: Security check to ensure only the author can fetch for editing
        if (blog.author._id.toString() !== req.user._id.toString()) {
             return ApiResponse(res, 403, false, "Unauthorized to edit this blog");
        }

        return ApiResponse(res, 200, true, "Blog details fetched for editing", blog);
    } catch (error) {
        return ApiResponse(res, 500, false, error.message);
    }
}

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({})
            .populate("author", "name username position")
            .sort({ createdAt: -1 });

        return ApiResponse(res, 200, true, "All blogs fetched successfully", blogs);
    } catch (error) {
        return ApiResponse(res, 500, false, error.message);
    }
}