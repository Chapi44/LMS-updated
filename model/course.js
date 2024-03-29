// course.js

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: String,
    paymentType: String,
    price: Number,
    coruseDiscrition:{
        type:String
    },
    aboutCourse:{
        type:String
    },
    createUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
categories:{
    type:[String]
},

  courseDuration:{
    type:String
  },
  userWhoHasBought: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}],
  coverPage:{
    type:[String]
  },
    chapter: [{
        LessonName: String,
        LessonFile: [{
            LessonType: String,
            LessonUrl: String
        }]
    }]
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
