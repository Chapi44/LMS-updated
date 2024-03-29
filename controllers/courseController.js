const Course = require('../model/course');
const User = require('../model/user');
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



const enrollCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const userId = req.user.userId; 
        console.log(userId);// Assuming you have authentication middleware to get the user ID

        // Check if the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Course not found' });
        }

        // Check if the user is already enrolled in the course
        if (course.userWhoHasBought.includes(userId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'User already enrolled in the course' });
        }

        // Add the user to the list of users who have bought the course
        course.userWhoHasBought.push(userId);
        await course.save();

        // Add the course to the user's enrolled courses
        const user = await User.findById(userId);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
        }
        user.enrolledCourses.push(courseId);
        await user.save();

        res.status(StatusCodes.OK).json({ message: 'User enrolled in the course successfully' });
    } catch (error) {
        console.error('Error enrolling user in course:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};


const getUserCourses = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // Assuming you have authentication middleware to get the user ID

        console.log(userId);

        // Find the user by ID and populate the enrolledCourses field to get the course details
        const user = await User.findById(userId).populate('enrolledCourses');
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
        }

        // Extract the enrolled courses from the user object
        const enrolledCourses = user.enrolledCourses;

        res.status(StatusCodes.OK).json({ enrolledCourses });
    } catch (error) {
        console.error('Error getting user courses:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};


module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    enrollCourse,
    getUserCourses 
};




