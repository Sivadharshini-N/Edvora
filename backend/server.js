import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDb from './config/db.js'
import errorHandler from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js'
import documentRoutes from './routes/documentRoutes.js'
import FlashcardRoutes from './routes/flashcardRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import progressRoutes from './routes/progressRoutes.js';





//ES6 module __dirname alternative
// Its more like a placeholder for future purpose
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);


const app = express();


// connect to db
connectDb();

// Middlewares

app.use( cors({
    origin:'*', //allow request from any orgin
    methods: ['GET','POST','PUT','DELETE'],  //allowed http methods
    allowedHeaders: ['Content-Type', 'Authorization'],  //headers that are allowed to send from the FE
    credentials: true  //allow cookies,auth headers
})
);

app.use(express.json()); //parses:incoming req, convert json into req.body
app.use(express.urlencoded({extended: true})); //parses: form data, allows nested obj





//static folder for uploads that serves file to the public that are avail in upload folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));//serves file to the public that are avail in upload folder

//Routes
app.use('/api/auth',authRoutes);
app.use('/api/document',documentRoutes);
app.use('/api/flashcards',FlashcardRoutes);
app.use('/api/ai',aiRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);

//Express uses a middleware pipeline architecture. so next() is used to pass control to the next middleware function in the stack. if we dont use next() the request will be left hanging and will not reach the route handler or error handler. so its important to call next() in our middlewares to ensure that the request is processed correctly and reaches the intended destination.
//if(next(err)) is used in a middleware, it will skip all the remaining middlewares and route handlers and directly jump to the error handling middleware. this is useful when we encounter an error in our middleware and want to pass it to the error handler for proper handling and response to the client. so using next(err) allows us to handle errors gracefully and maintain a clean separation of concerns in our application.
app.use(errorHandler); // should be after all routes because of the middleware stack
//it runs when next(err) is called in any of the middlewares or route handlers or when an unhandled error occurs in the application. it catches the error and sends a proper response to the client based on the type of error and the environment (development or production).


//error handler - runs when no routes are matched more like a 'catch-ALL'
app.use((req,res) => {
    res.status(404).json({
        success:false,
        error: "Route not found",
        statusCode: 404
    })
});




//server start listening for requests
const PORT = process.env.PORT || 8000;
app.listen(PORT,(()=>{
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}))

//catches all the unhandled promises at last
process.on('unhandledRejection', (err)=> {
    console.error(`Error: ${err.message}`);
    process.exit(1);
})
