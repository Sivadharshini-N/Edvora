import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId, //links to specific user 
        required:true,
        ref:'User' // we can do "Quiz.find().populate("userId")" (population-fetch all users) -- acts more like a foreign key 
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,//links to specific document
        ref:'Document',
        required:true
    },
    title: {
        type: String,
        required:true,
        trim:true
    },
    questions:[{
        question:{
            type:String,
            required:true
        },
        options:{
            type:[String],
            required:true,
            validate: [(arr) => arr.length === 4,'Must have only 4 options']
        },
        correctAnswer:{
            type:String,
            required:true,
            trim:true
        },
        explanation: {
            type:String,
            default:''
        },
        difficulty:
        {
            type:String,
            enum:['easy','medium','hard'], //part of mongoose - only these values are accepted in this field
            default:'medium'
        }
    }],
    userAnswers:[{
        questionIndex:{
            type:Number,
            required:true,

        },
        selectedAnswer:{
            type:String,
            required:true
        },
        isCorrect:{
            type:Boolean,
            required:true
        },
        answeredAt:{
            type:Date,
            default:null
        }
    }],
    scores:{
        type:Number,
        default:0
    },
    totalQuestions:{
        type:Number,
        required:true
    },
    completedAt:{
        type:Date,
        default:Date.now()
    }

},{timestamps:true});

//index for fasster queries

quizSchema.index({userId:1,documentId:1}); // -1 will take in descending order . 1 for ascending order

const Quiz = mongoose.model('Quiz',quizSchema); 
export default Quiz;