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
        
        // 2. Create new Blog document in MongoDB
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
             deleteCloudinaryImage(result.public_id);
        }
        // Handle duplicate title or validation error
        if (error.code === 11000) {
             return res.status(400).json({ error: `Blog post with title '${title}' already exists.` });
        }
        res.status(400).json({ error: 'Blog creation failed due to invalid data.' });
    }
};


// ---------------------------------------------------------------------
// | 2. READ All Blogs (GET)                                           |
// ---------------------------------------------------------------------

/**
 * @desc Fetches all blog posts.
 * @route GET /api/blogs
 * @access Public
 */
const getBlogs = async (req, res) => {
    try {
        // Fetch all blogs, showing the newest first
        const blogs = await Blog.find({})
            .sort({ createdAt: -1 })
            .select('-content'); // Exclude content for list view (optional optimization)
            
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ error: 'Server failed to retrieve blog posts.' });
    }
};


// ---------------------------------------------------------------------
// | 3. READ Single Blog (GET)                                         |
// ---------------------------------------------------------------------

/**
 * @desc Fetches a single blog post by ID.
 * @route GET /api/blogs/:id
 * @access Public
 */
const getBlog = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such blog post found.' });
    }

    try {
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ error: 'No such blog post found.' });
        }

        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ error: 'Server failed to retrieve blog post.' });
    }
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

        // Perform the update
        // We use findOneAndUpdate with runValidators: true for title uniqueness check
        const blog = await Blog.findOneAndUpdate(
            { _id: id, user: userId }, 
            { $set: updateBody }, 
            { new: true, runValidators: true }
        );


        if (!blog) {
            return res.status(404).json({ error: 'No such blog post or not authorized to update.' });
        }

        res.status(200).json({ message: 'Blog post updated successfully!', blog });

    } catch (error) {
        console.error('Blog update failed:', error.message);
        
        // Rollback: Delete the newly uploaded image if Mongoose update fails
        if (result && result.public_id) {
             await deleteCloudinaryImage(result.public_id);
        }
        // Handle duplicate title or validation error
        if (error.code === 11000) {
             return res.status(400).json({ error: `Blog post with title '${updateBody.title}' already exists.` });
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