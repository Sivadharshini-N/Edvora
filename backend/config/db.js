//basically config folder is for db connection and other configuration related stuff. The third party packages are imported here and then exported to be used in other parts of the application. This way we can keep our code organized and modular.
/*Config for services like:
All configuration req for app, in one place.
Email (Nodemailer)
Cloud storage (AWS, Cloudinary)
Auth providers
logging libraries setup
Payment gateways*/


import mongoose from "mongoose";

const connectDb = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected ${conn.connection.host}`);
    }
    catch(error){
        console.error(`Error connecting to mongoDB ${error.message}`);
        process.exit(1); //stops node.js process (0) successful exit, (1) failure exit
    }
};

export default connectDb;