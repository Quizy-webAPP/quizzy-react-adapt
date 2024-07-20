// routes/schoolRoutes.js
const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const auth = require('../middleware/auth'); // Assuming you have an auth middleware

router.post('/', auth, schoolController.createSchool);
router.get('/', auth, schoolController.getSchools);
router.get('/:id', auth, schoolController.getSchoolById);
router.put('/:id', auth, schoolController.updateSchool);
router.delete('/:id', auth, schoolController.deleteSchool);

module.exports = router;
