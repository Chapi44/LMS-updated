const Course = require('../model/course');
const { StatusCodes } = require('http-status-codes');
const baseURL = process.env.BASE_URL;
const path = require('path');

const createCourse = async (req, res) => {
    const userId=req.user.userId;

    try {
        const { 
            courseName, 
            paymentType, 
            chapter, 
            price, 
            courseDescription, 
            aboutCourse, 
            categories, 
            courseDuration 
        } = req.body;

        // Check if files are included in the request for cover pages
        if (!req.files || !req.files['coverPage'] || !Array.isArray(req.files['coverPage'])) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No cover page files uploaded or invalid file format' });
        }

        const lessonFiles = req.files['files'].map(file => ({
            LessonType: file.mimetype,
            LessonUrl: baseURL + "/uploads/course/" + file.filename
        }));

        // Map uploaded cover page image files to their URLs with base URL
        const coverPageImages = req.files['coverPage'].map(file => baseURL + "/uploads/course/coverpage/" + file.filename);

        const newCourse = await Course.create({
            courseName,
            paymentType,
            price,
            courseDescription,
            aboutCourse,
            categories,
            courseDuration,
            chapter: chapter.map(chapter => ({
                LessonName: chapter.LessonName,
                LessonFile: lessonFiles
            })),
            coverPage: coverPageImages,
            createUser: userId

        });

        res.status(StatusCodes.CREATED).json({ message: 'Course created successfully', course: newCourse });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

module.exports = { createCourse };



async function getAllCourses(req, res) {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
}

async function getCourseById(req, res) {
    const courseId = req.params.id;
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json(course);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
}


module.exports = {
    createCourse,
    getAllCourses,
    getCourseById
};




