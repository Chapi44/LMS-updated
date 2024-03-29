const express = require('express');
const router = express.Router();
const multer = require('multer');
const courseController = require('../controllers/courseController');
const path = require('path');

const {
    authenticateUser,
    authorizePermissions,
  
  }= require("../middleware/authentication")



// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Check the fieldname to determine the destination folder
        if (file.fieldname === 'coverPage') {
            cb(null, 'uploads/course/coverpage');
        } else {
            // Default destination if fieldname doesn't match
            cb(null, 'uploads/course');
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Route to create a new course
router.post('/', upload.fields([
    { name: 'files', maxCount: 10 }, // Assuming this is for other files like lesson files
    { name: 'coverPage', maxCount: 6 } // Handle coverPage files
]), authenticateUser, courseController.createCourse);

// Route to get all courses
router.get('/', courseController.getAllCourses);

// Route to get a course by ID
router.get('/:id', courseController.getCourseById);

module.exports = router;