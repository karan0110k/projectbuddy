const Project = require('../models/Project');

// @desc    Create a project request
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { title, description, domain, budget, deadline } = req.body;

    let attachmentPath = null;
    if (req.file) {
      attachmentPath = req.file.path;
    }

    const project = new Project({
      user: req.user._id,
      title,
      description,
      domain,
      budget,
      deadline,
      attachmentPath,
    });

    const createdProject = await project.save();
    
    // Auto-create initial Welcome Message by Bot
    const Message = require('../models/Message');
    await Message.create({
      project: createdProject._id,
      senderType: 'bot',
      text: 'Thanks for contacting us! We will review your project and answer shortly. Please feel free to provide any extra details here in the meantime.'
    });

    res.status(201).json(createdProject);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user projects
// @route   GET /api/projects/myprojects
// @access  Private
const getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private/Admin
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Update project status
// @route   PUT /api/projects/:id/status
// @access  Private/Admin
const updateProjectStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const project = await Project.findById(req.params.id);

    if (project) {
      project.status = status;
      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Upload project zip deliverable
// @route   PUT /api/projects/:id/deliver
// @access  Private/Admin
const deliverProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      if (req.file) {
        project.deliveryPath = req.file.path;
        project.status = 'completed';
      }
      
      const updatedProject = await project.save();
      // Populate user so frontend gets full data back
      const populated = await Project.findById(updatedProject._id).populate('user', 'name email');
      res.json(populated);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getMyProjects,
  getProjects,
  updateProjectStatus,
  deliverProject
};
