import jwt from 'jsonwebtoken';
import User from '../models/User.js';

//this middleware checks token exists, verifies token on protected routes, find user in db, allow access to protected routes
const protect = async (req,res,next) => {
    let token; // we dont know whether the user has token or not,
    
    //check if token exists
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try{
            token = req.headers.authorization.split(' ')[1];// req.header would have something like ""Bearer TOKEN"" => ["Bearer", "TOKEN"]

            //verify token
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            //if we didnt add user details to the req then the controller has to do thi(findById) all the time when needed
            req.user = await User.findById(decoded.id).select('-password'); //attaching user details to req, becoz req comes only with token - now we are getting the user with the help of token (getting user details w/o password!)

            if(!req.user){
                return res.status(401).json({
                    success:false,
                    error:'User not found',
                    statusCode: 401
                });
            }

            next(); //to avoid unhandled error - in middlewares express doesn't  move to next function explicitly. so we have to ask it move to the next function
        }
        catch(error){
            console.error('Auth Middleware error:',error.message);

            if(error.name==='TokenExpiredError')
            {
                return res.status(401).json({
                    success:false,
                    message:'Token expired',
                    statusCode:401
                });
            }

            return res.status(401).json({
                success:false,
                message:'Not authorized, token failed',
                statusCode:401
            });
        }
    }

    if(!token) //if no header is passesed in req
    {
        res.status(401).json({
            success:false,
            message:'Not authorized, token failed',
            statusCode:401
        });
    }

}

export default protect;