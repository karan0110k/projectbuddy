const express = require('express');
const router = express.Router();
const {
  createProject,
  getMyProjects,
  getProjects,
  updateProjectStatus,
  deliverProject
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .post(protect, upload.single('attachment'), createProject)
  .get(protect, admin, getProjects);

router.route('/myprojects').get(protect, getMyProjects);
router.route('/:id/status').put(protect, admin, updateProjectStatus);
router.route('/:id/deliver').put(protect, admin, upload.single('delivery'), deliverProject);

module.exports = router;
