import jwt from 'jsonwebtoken' // used to create and verify jwt token . jwt - json web token
import User from '../models/User.js';

//creates a login token for user when registered or logined - token proves this user is authenticated
const generateToken = (id) => { //this will be called later in this program
    return jwt.sign({id}, process.env.JWT_SECRET, { //jwt.sign(payload,secret key, options) - payload is to represent that inside this token store user's id
        expiresIn:process.env.JWT_EXPIRE || '7d'
    });
};

//@desc     Register new user
//@route    POST/api/auth/register
//@access   public


export const register = async (req,res,next) =>{//here next is to intimate express to move to the next middleware or function - next(error) will jump to error handler
    try{
        const {username, email, password} = req.body;

        const userExists = await User.findOne({ $or:[{email}]});

        if(userExists){
            return res.status(400).json({
                success:false,
                error: userExists.email === email ? 'Email already registered':'Username already taken',
                statusCode:400
            });
        }

        const user = await User.create({
            username,
            email,
            password,

        });


        const token = generateToken(user._id); //user._id is the object id of each doc in mongodb

        res.status(201).json({
            success:true,
            data: {
                user:{
                    id: user.__id,
                    username:user.username,
                    email: user.email,
                    profileImage: user.profileImage,
                    createdAt: user.createdAt
                },
                token
            },
            message: 'User registered successfully'
        });
    }
    catch(error){
        next(error);// app.use(err,req,res,next) - global error handler
    }
};


//@desc Login user
//@route POST/api/auth/login
//@access public

export const login = async (req,res,next) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email}).select('+password');

        if(!user){
            res.status(401).json({
                success:false,
                message:'User not found, Try valid credentials',
                statusCode:401
            })
        }

        //check password
        const isMatch = await user.matchPassword(password); // not User its user - User is a model, we are saying call match password for this particular user.

        if(!isMatch){
            res.status(401).json({
                success:false,
                Message:'Password mismatch, Try valid password',
                statusCode:401
            });
        };

        //generate token
        const token = generateToken(user._id);

        res.status(200).json({ //sending user details for the FE
            success:true,
            user:{
                id:user._id,
                username:user.username,
                email:user.email,
                profileImage:user.profileImage
            },
            token, //sending token in response for future response - its sotred in browsers local storage
            message:'Login successful'
        }); 
    }
    catch(error){
        next(error);
    }

};



//desc  get user profile
//route GET/api/auth/profile
//access private
export const getProfile = async (req,res,next) =>{
    try{
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success:true,
            data:{
                id: user._id,
                username:user.username,
                email:user.email,
                profileImage:user.profileImage,
                createdAt:user.createdAt,
                updatedAt:user.updatedAt
            }
        });
    }
    catch(error){
        next(error);
    }

}


//desc update user profile
//route PUT/api/auth/profile
//access private
export const updateProfile = async (req,res,next) => {
    try{

        const {username, email, profileImage} = req.body;

        const user = await User.findById(req.user._id);

        if(username) user.username = username;
        if(email) user.email=email;
        if(profileImage)  user.profileImage=profileImage;

        await user.save();

        res.status(200).json({
            success:true,
            data:{
                id:user._id,
                username:user.username,
                email:user.email,
                profileImage:user.profileImage
            },
            message:'Profile updated successfully'
        });
    }
    catch(error){
        next(error);
    }

};


//desc change user password
//route POST/api/auth/change-password
//access private

export const changePassword = async (req,res,next) => {
    try{

        const {currentPassword, newPassword} = req.body;

        if(!currentPassword || !newPassword)
        {
            res.status(401).json({
                success:false,
                error:'Please enter current and new password',
                statusCode:401

            });
        }

        const user = await User.findById(req.user._id).select("+password");

        const isMatch = user.matchPassword(currentPassword);

        if(!isMatch)
        {
            res.status(401).json({
                success:false,
                error:'Current password is incorrect',
                statusCode:401
            })
        }
        

        user.password=newPassword;
        await user.save();

        res.status(200).json({
            success:true,
            message:'Password changed successfully',
            statusCode:200
        })

    }
    catch(error){
        next(error);
    }

};