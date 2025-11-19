// backend/controllers/BlogController.js

const Blog = require('../models/BlogModel');
const cloudinary = require('../config/cloudinary.config');
const mongoose = require('mongoose');

/**
 * @desc Helper: Deletes an image from Cloudinary using its Public ID.
 * @param {string} publicId - The unique ID of the of the image on Cloudinary.
 */
const deleteCloudinaryImage = async (publicId) => {
    if (publicId) {
        await cloudinary.uploader.destroy(publicId);
    }
};


// ---------------------------------------------------------------------
// | 1. CREATE Blog (POST)                                             |
// ---------------------------------------------------------------------

/**
 * @desc Creates a new blog post, handles thumbnail upload, and saves to MongoDB.
 * @route POST /api/blogs
 * @access Private (Requires Admin Token)
 */
const createBlog = async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user._id; // User ID from requireAuth middleware
    let result;

    if (!req.file) {
        return res.status(400).json({ error: 'Thumbnail upload failed. No file provided.' });
    }
    
    try {
        // 1. Upload thumbnail image to Cloudinary from memory buffer
        result = await cloudinary.uploader.upload(
            'data:' + req.file.mimetype + ';base64,' + req.file.buffer.toString('base64'), 
            {
                folder: `my-portfolio-blogs/${userId}`, 
                transformation: [ { width: 1000, crop: 'limit' } ] // Optimize for blog thumbnail size
            }
        );
        
        // 2. Create new Blog document in MongoDB (Slug is generated automatically by pre-save hook)
        const blog = await Blog.create({
            title,
            content,
            thumbnailUrl: result.secure_url,
            thumbnailPublicId: result.public_id,
            user: userId, // Link to the authenticated Admin user
        });
        
        res.status(201).json({ 
            message: 'Blog post created successfully!',
            blog
        });

    } catch (error) {
        console.error('Blog creation failed:', error.message); 
        
        // Rollback: Delete the uploaded image if DB save fails
        if (result && result.public_id) {
             await deleteCloudinaryImage(result.public_id);
        }
        
        // Handle duplicate title or slug/validation error
        if (error.code === 11000) {
             return res.status(400).json({ error: `Blog post title is not unique or results in an existing slug.` });
        }
        res.status(400).json({ error: 'Blog creation failed due to invalid data.' });
    }
};


// ---------------------------------------------------------------------
// | 2. READ All Blogs (GET) - ADDED PAGINATION & SEARCH               |
// ---------------------------------------------------------------------

/**
 * @desc Fetches all blog posts with optional pagination and search.
 * @route GET /api/blogs?page=1&limit=10&search=keyword
 * @access Public
 */
const getBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        let query = {};

        // 1. Search Filter (by title or content snippet)
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                // Only search title, as content is excluded from list view
                // For demonstration, we include content in search query for backend efficiency
                { content: { $regex: search, $options: 'i' } },
            ];
        }

        // Get total count matching the query (for pagination metadata)
        const totalBlogs = await Blog.countDocuments(query);

        // Fetch paginated blogs, showing the newest first
        const blogs = await Blog.find(query)
            .sort({ createdAt: -1 })
            .select('-content') // Exclude content for list view
            .skip(skip)
            .limit(limitNumber);
            
        res.status(200).json({
            data: blogs,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalBlogs / limitNumber),
            totalItems: totalBlogs
        });
    } catch (error) {
        console.error('Blog retrieval failed:', error.message);
        res.status(500).json({ error: 'Server failed to retrieve blog posts.' });
    }
};


// ---------------------------------------------------------------------
// | 3. READ Single Blog (GET)                                         |
// ---------------------------------------------------------------------

/**
 * @desc Fetches a single blog post by SLUG or ID.
 * The route uses SLUG for public access but accepts ID for internal/admin use (via separate route definition).
 * @route GET /api/blogs/:slugOrId
 * @access Public / Private
 */
const getBlog = async (req, res) => {
    const { slugOrId } = req.params;

    let blog;

    // 1. Check if the parameter is a valid MongoDB ID (Used for internal Admin access)
    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
        blog = await Blog.findById(slugOrId);
    }
    
    // 2. If not found by ID or invalid ID, search by slug (Used for public access)
    if (!blog) {
         // Use findOne({ slug: ... }) to ensure we find the correct document
        blog = await Blog.findOne({ slug: slugOrId });
    }

    if (!blog) {
        return res.status(404).json({ error: 'No such blog post found.' });
    }

    res.status(200).json(blog);
};


// ---------------------------------------------------------------------
// | 4. DELETE Blog (DELETE)                                           |
// ---------------------------------------------------------------------

/**
 * @desc Deletes a blog post and its associated thumbnail from Cloudinary. Requires authorization.
 * @route DELETE /api/blogs/:id
 * @access Private (Admin Only)
 */
const deleteBlog = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such blog post found.' });
    }

    try {
        // Find and delete: ensure ID and user ID match for authorization
        const blog = await Blog.findOneAndDelete({ _id: id, user: userId });

        if (!blog) {
            return res.status(404).json({ error: 'No such blog post or not authorized to delete.' });
        }

        // Delete the associated thumbnail from Cloudinary
        await deleteCloudinaryImage(blog.thumbnailPublicId);

        res.status(200).json({ 
            message: 'Blog post deleted successfully!', 
            blog 
        });
    } catch (error) {
        console.error('Blog deletion failed:', error.message);
        res.status(500).json({ error: 'Server failed to delete blog post.' });
    }
};


// ---------------------------------------------------------------------
// | 5. UPDATE Blog (PATCH)                                            |
// ---------------------------------------------------------------------

/**
 * @desc Updates a blog post, handling optional thumbnail replacement and authorization.
 * @route PATCH /api/blogs/:id
 * @access Private (Admin Only)
 */
const updateBlog = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    let result;
    
    let updateBody = { ...req.body };

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such blog post found.' });
    }

    try {
        
        // --- Logic: Handling Image Update (if req.file exists) ---
        if (req.file) {
            const oldBlog = await Blog.findById(id);
            if (!oldBlog) throw new Error('Blog post not found');

            // Upload new image
            result = await cloudinary.uploader.upload(
                'data:' + req.file.mimetype + ';base64,' + req.file.buffer.toString('base64'), 
                {
                    folder: `my-portfolio-blogs/${userId}`, 
                    transformation: [ { width: 1000, crop: 'limit' } ]
                }
            );

            // Update body with new image details
            updateBody.thumbnailUrl = result.secure_url;
            updateBody.thumbnailPublicId = result.public_id;
            
            // Delete old image from Cloudinary
            await deleteCloudinaryImage(oldBlog.thumbnailPublicId);
        }

        // --- Perform the update using Find and Save to trigger pre('save') slug generation hook ---
        const blogToUpdate = await Blog.findById(id);
        if (!blogToUpdate) {
             // Rollback image upload if blog not found
            if (result && result.public_id) { await deleteCloudinaryImage(result.public_id); }
            return res.status(404).json({ error: 'No such blog post or not authorized to update.' });
        }

        // Manually update fields
        for (const key in updateBody) {
            if (blogToUpdate.schema.paths[key]) {
                blogToUpdate[key] = updateBody[key];
            }
        }
        
        // The pre('save') hook in BlogModel.js will handle slug re-generation if the title was modified.
        const updatedBlog = await blogToUpdate.save();

        res.status(200).json({ message: 'Blog post updated successfully!', blog: updatedBlog });

    } catch (error) {
        console.error('Blog update failed:', error.message);
        
        // Rollback: Delete the newly uploaded image if Mongoose update/save fails
        if (result && result.public_id) {
             await deleteCloudinaryImage(result.public_id);
        }
        // Handle duplicate title or slug/validation error
        if (error.code === 11000) {
             return res.status(400).json({ error: `Blog post title is not unique or results in an existing slug.` });
        }
        res.status(400).json({ error: 'Blog update failed due to invalid data.' });
    }
};


module.exports = {
    createBlog,
    getBlogs,
    getBlog,
    deleteBlog,
    updateBlog
};