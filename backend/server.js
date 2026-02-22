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





//static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));//serves file to the public that are avail in upload folder


//Routes
app.use('/api/auth',authRoutes);
app.use('/api/document',documentRoutes);
app.use('/api/flashcards',FlashcardRoutes);
app.use('/api/ai',aiRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);


app.use(errorHandler);



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
