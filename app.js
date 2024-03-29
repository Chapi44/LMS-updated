require("express-async-errors");

const cors = require("cors");
const express = require("express");
const http = require("http");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const connectDB = require("./db/connect.js");
// const authRouter = require("./routes/authRouter");
// const userRouter = require("./routes/userroutes.js");
const courseRoutes = require("./routes/courseRoutes.js")
// const InstructorRoutes = require('./routes/InstructorRouter.js')

// const corsOptions = require("./config/corsOptions.js")

// Middleware
const notFoundMiddleware = require("./middleware/not-found.js");
const errorHandlerMiddleware = require("./middleware/error-handler.js");


app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
// app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/users", userRouter);
app.use('/api/v1/course',courseRoutes)
// app.use('/api/v1/Instruct',InstructorRoutes);



app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();




































// // app.js

// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const path = require('path');
 
// // Connect to MongoDB
// mongoose.connect("mongodb+srv://enterct35i:Ya20161913@cluster0.tkppfeg.mongodb.net/hello?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//     console.log('Connected to MongoDB');
// });

// // Define Course Schema
// const courseSchema = new mongoose.Schema({
//     courseName: String,
//     paymentType: String,
//     payment: Number,
//     chapter: [{
//         LessonName: String,
//         LessonFile: [{
//             LessonType: String,
//             LessonUrl: String
//         }]
//     }]
// });

// // Create Course Model
// const Course = mongoose.model('Course', courseSchema);

// // Initialize Express app
// const app = express();

// // Middleware
// app.use(bodyParser.json());

// // Multer Configuration
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// const upload = multer({ storage: storage });

// // Routes
// app.post('/courses', upload.array('files'), async (req, res) => {
//     try {
//         const { courseName, paymentType, payment, chapter } = req.body;
//         const files = req.files;
        
//         // Process uploaded files and generate Lesson objects
//         const lessonFiles = files.map(file => ({
//             LessonType: file.mimetype,
//             LessonUrl: file.path
//         }));

//         const course = new Course({
//             courseName,
//             paymentType,
//             payment,
//             chapter: chapter.map(chapter => ({
//                 LessonName: chapter.LessonName,
//                 LessonFile: lessonFiles
//             }))
//         });

//         const savedCourse = await course.save();
//         res.status(201).json(savedCourse);
//     } catch (err) {
//         console.log(err);
//         res.status(400).json({ message: err.message });
//     }
// });

// // Serve uploaded files statically
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Start the server
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
