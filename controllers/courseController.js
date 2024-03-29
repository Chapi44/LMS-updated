// courseController.js


const Course = require('../model/course');
const baseURL = process.env.BASE_URL;
const path = require('path')


async function createCourse(req, res) {
    // const userId = req.user.userId;
    try {
        const { courseName, paymentType, chapter, price,
            courseDescription, 
            aboutCourse,
            catagories, 
            courseDuration,
            // coverPage
         } = req.body;
        const files = req.files;
        
        // Process uploaded files and generate Lesson objects
        const lessonFiles = files.map(file => ({
            LessonType: file.mimetype,
            LessonUrl: baseURL + "/uploads/" + path.basename(file.path) // Construct lesson URLs with base URL
        }));

        const course = new Course({
            courseName,
            paymentType,
            price,
            courseDescription, 
            aboutCourse,
            catagories, 
            courseDuration,
            
            chapter: chapter.map(chapter => ({
                LessonName: chapter.LessonName,
                LessonFile: lessonFiles
            }))
        });

        const savedCourse = await course.save();
        res.status(201).json(savedCourse);
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
}


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




