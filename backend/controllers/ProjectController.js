const Project = require('../models/ProjectModel');
const cloudinary = require('../config/cloudinary.config');
const mongoose = require('mongoose');
const Technology = require('../models/TechnologyModel');

/**
 * @desc Helper: Deletes an image from Cloudinary using its Public ID.
 * @param {string} publicId - The unique ID of the of the image on Cloudinary.
 */
const deleteCloudinaryImage = async (publicId) => {
    if (publicId) {
        await cloudinary.uploader.destroy(publicId);
    }
};

/**
 * @desc Helper: Processes the 'technologies' field sent via form-data (as a string or array).
 * This function is critical for cleaning the input before Mongoose validation.
 * @param {string | Array} technologies - The input from the request body.
 * @returns {Array} Array of processed technology IDs.
 */
const processTechnologies = (technologies) => {
    // CASE 1: Input is Array (received from repeated form-data fields)
    if (Array.isArray(technologies)) {
        // Clean quotes and trim spaces from each array element
        return technologies.map(id => {
            if (typeof id === 'string') {
                return id.replace(/[\[\]\'\" ]/g, '').trim(); 
            }
            return String(id);
        }).filter(id => id.length > 0);
    } 
    
    // CASE 2: Input is a single comma-separated string
    if (typeof technologies === 'string') {
        // Clean brackets/quotes and split by comma
        let cleanedString = technologies.replace(/[\[\]\'\"]/g, ''); 
        return cleanedString
            .split(',')
            .map(id => String(id.trim())) 
            .filter(id => id.length > 0);
    }
    
    // Default: if no input
    return [];
};


// ---------------------------------------------------------------------
// | 1. CREATE Project (POST)                                          |
// ---------------------------------------------------------------------

/**
 * @desc Creates a new project, handles file upload to Cloudinary, and saves to MongoDB.
 * @route POST /api/projects
 * @access Private (Requires Admin Token)
 */
const createProject = async (req, res) => {
    // Menggunakan 'content'
    const { title, content, technologies, demoUrl, repoUrl } = req.body;
    const userId = req.user._id;
    let result;

    // --- Validasi Data Awal ---
    if (!title || !content) {
        return res.status(400).json({ error: 'Validation failed: Title and content are required.' });
    }
    
    if (!req.file) {
        return res.status(400).json({ error: 'Image upload failed. No file provided.' });
    }
    // ---------------------------
    
    try {
        // 1. Upload image to Cloudinary from memory buffer
        result = await cloudinary.uploader.upload(
            'data:' + req.file.mimetype + ';base64,' + req.file.buffer.toString('base64'), 
            {
                folder: `my-portfolio-projects/${userId}`, 
                transformation: [ { width: 800, crop: 'limit' } ]
            }
        );
        
        // 2. Process technologies (will return a clean array of IDs)
        const processedTechnologies = processTechnologies(technologies);

        // Validation: Check if all provided Technology IDs exist
        if (processedTechnologies.length > 0) {
            const existingTechnologies = await Technology.find({ '_id': { $in: processedTechnologies } });
            
            if (existingTechnologies.length !== processedTechnologies.length) {
                await deleteCloudinaryImage(result.public_id);
                throw new Error('One or more technology IDs provided do not exist.');
            }
        }
        
        // 3. Create new Project document 
        // Menggunakan Project.create() karena tidak ada lagi hook pre('save') untuk slug.
        const project = await Project.create({
            title,
            content,
            technologies: processedTechnologies,
            imageUrl: result.secure_url,
            imagePublicId: result.public_id,
            demoUrl,
            repoUrl,
            user: userId,
        });
        
        res.status(201).json({ 
            message: 'Project created successfully!',
            project
        });

    } catch (error) {
        console.error('Project creation failed:', error.message); 
        
        // Rollback: Delete the uploaded image if DB save fails
        if (result && result.public_id) {
             await deleteCloudinaryImage(result.public_id);
        }
        
        if (error.code === 11000) { 
             return res.status(400).json({ error: `Project title '${title}' is too similar to an existing project.` });
        }
        
        // Handle Mongoose Validation Error
        if (error.name === 'ValidationError') {
            // Karena tidak ada slug, error validation biasanya terkait required fields lain
            return res.status(400).json({ error: `Project validation failed: ${error.message}` });
        }
        
        res.status(400).json({ error: 'Project creation failed due to invalid data.' });
    }
};


// ---------------------------------------------------------------------
// | 2. READ All Projects (GET) - Pagination & Search                  |
// ---------------------------------------------------------------------

/**
 * @desc Fetches all projects with optional pagination, search, and technology filtering. Includes full content.
 * @route GET /api/projects?page=1&limit=10&search=keyword&tech=id1,id2
 * @access Public (Intended for Portfolio Viewers)
 */
const getProjects = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, tech } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        let query = {};

        // 1. Search Filter (by title or content)
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
            ];
        }

        // 2. Technology Filter (by comma-separated technology IDs)
        if (tech) {
            const techIds = tech.split(',').filter(id => mongoose.Types.ObjectId.isValid(id));
            if (techIds.length > 0) {
                // Filter projects that include ANY of the provided technology IDs
                query.technologies = { $in: techIds }; 
            }
        }

        // Get total count matching the query (for pagination metadata)
        const totalProjects = await Project.countDocuments(query);

        // Fetch paginated projects and populate the technology details
        const projects = await Project.find(query)
            .populate('technologies', 'name') 
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);
            
        res.status(200).json({
            data: projects,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalProjects / limitNumber),
            totalItems: totalProjects
        });
    } catch (error) {
        console.error('Project retrieval failed:', error.message);
        res.status(500).json({ error: 'Server failed to retrieve projects.' });
    }
};


// ---------------------------------------------------------------------
// | 3. READ Single Project (GET) - Kembali ke ID                      |
// ---------------------------------------------------------------------

/**
 * @desc Fetches a single project by ID.
 * @route GET /api/projects/:id
 * @access Public / Private
 */
const getProject = async (req, res) => {
    const { id } = req.params; // 💡 PERUBAHAN: Kembali ke :id

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such project' });
    }

    try {
        // Mencari berdasarkan ID
        const project = await Project.findById(id).populate('technologies', 'name');

        if (!project) {
            return res.status(404).json({ error: 'No such project' });
        }

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: 'Server failed to retrieve project.' });
    }
};


// ---------------------------------------------------------------------
// | 4. DELETE Project (DELETE)                                        |
// ---------------------------------------------------------------------

/**
 * @desc Deletes a project and its associated image from Cloudinary. Requires authorization.
 * @route DELETE /api/projects/:id
 * @access Private (Admin Only)
 */
const deleteProject = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such project' });
    }

    try {
        // Find and delete: ensure project ID and user ID match for authorization
        const project = await Project.findOneAndDelete({ _id: id, user: userId });

        if (!project) {
            return res.status(404).json({ error: 'No such project or not authorized to delete' });
        }

        // Delete the associated image from Cloudinary
        await deleteCloudinaryImage(project.imagePublicId);

        res.status(200).json({ 
            message: 'Project deleted successfully!', 
            project 
        });
    } catch (error) {
        // Catch server-side error during deletion (e.g., Cloudinary API failure)
        console.error('Project deletion failed:', error.message);
        res.status(500).json({ error: 'Server failed to delete project.' });
    }
};


// ---------------------------------------------------------------------
// | 5. UPDATE Project (PATCH)                                         |
// ---------------------------------------------------------------------

/**
 * @desc Updates a project, handling optional image replacement and authorization.
 * @route PATCH /api/projects/:id
 * @access Private (Admin Only)
 */
const updateProject = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    let result;
    
    let updateBody = { ...req.body }; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such project' });
    }

    try {
        // --- Logic: Processing Technologies Update ---
        if (updateBody.technologies) {
             const processedTechnologies = processTechnologies(updateBody.technologies);
             
             // Validation: Check if all provided Technology IDs exist
             if (processedTechnologies.length > 0) {
                 const existingTechnologies = await Technology.find({ '_id': { $in: processedTechnologies } });
                 if (existingTechnologies.length !== processedTechnologies.length) {
                     throw new Error('One or more technology IDs provided do not exist.');
                 }
             }
             updateBody.technologies = processedTechnologies;
        }
        
        // --- Logic: Handling Image Update (if req.file exists) ---
        if (req.file) {
            const oldProject = await Project.findById(id);
            if (!oldProject) throw new Error('Project not found');

            // Upload new image
            result = await cloudinary.uploader.upload(
                'data:' + req.file.mimetype + ';base64,' + req.file.buffer.toString('base64'), 
                {
                    folder: `my-portfolio-projects/${userId}`, 
                    transformation: [ { width: 800, crop: 'limit' } ]
                }
            );

            // Update body with new image details
            updateBody.imageUrl = result.secure_url;
            updateBody.imagePublicId = result.public_id;
            
            // Delete old image from Cloudinary
            await deleteCloudinaryImage(oldProject.imagePublicId);
        }

        // Perform the update
        const project = await Project.findOneAndUpdate(
            { _id: id, user: userId }, 
            { $set: updateBody }, 
            { new: true, runValidators: true }
        ).populate('technologies', 'name');
        
        if (!project) {
            // Rollback image upload if project not found
            if (result && result.public_id) { await deleteCloudinaryImage(result.public_id); }
            return res.status(404).json({ error: 'No such project or not authorized to update' });
        }


        res.status(200).json({ message: 'Project updated successfully!', project });


    } catch (error) {
        console.error('Project update failed:', error.message);
        
        // Rollback: Delete the newly uploaded image if Mongoose update/save fails
        if (result && result.public_id) {
             await deleteCloudinaryImage(result.public_id);
        }
        
        if (error.code === 11000) { // Handle uniqueness error (e.g., title)
             return res.status(400).json({ error: 'Project title already exists.' });
        }

        // Handle Mongoose Validation Error
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: `Project validation failed: ${error.message}` });
        }

        res.status(400).json({ error: 'Project update failed due to invalid data.' });
    }
};


module.exports = {
    createProject,
    getProjects,
    getProject,
    deleteProject,
    updateProject
};