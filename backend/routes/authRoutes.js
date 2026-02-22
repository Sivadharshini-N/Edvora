import express from 'express';
import {body} from 'express-validator';//used to validate req.body data eg: body('email').validations... - check body before proceeding
import {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword
} from '../controllers/authController.js';
import protect from '../middlewares/auth.js';


//routes are meant for creating endpoints and for validating 

const router = express.Router();

//middlewares that's being passed in route
const registerValidation = [
    body('username')
    .trim()
    .isLength({min:3})
    .withMessage('Username must be at least 3 characters'),
    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Enter a valid email'),
    body('password')
    .isLength({min:6})
    .withMessage('Password must be at least 6 characters')
];


const loginValidation = [
    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Enter the email'),
    body('password')
    .notEmpty()
    .withMessage('Password is required')
];


//routes
router.post('/register', registerValidation, register);// express passes the req.body to every middleware listed in the route that's why registervalidatioin could access the req.body
router.post('/login',loginValidation, login);


//protected routes
router.get('/profile',protect, getProfile); // this is the authorization. if the token is valid- controllers runs/ otherwise access denied
router.put('/profile',protect,updateProfile);
router.post('/change-password',protect, changePassword);

export default router;


