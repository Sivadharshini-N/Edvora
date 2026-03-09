import mongoose from "mongoose"; //(ODM) obj data modeling lib for mongodb - defines schema, validate data, create models, interact with DB using js objects
import bcrypt from 'bcryptjs'; // a lib used to hash passwords

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'], // [condition , custom Error msg] - it is not js, it is library(mongoose) specific syntax 
        unique: true,
        trim: true,
        minlength:[3, 'Username must be at least 3 characters']// mongoose treat condition = arr[0] errmsg=arr[1] - so if we add more array elements, mongoose will simply omit it 
    },
    email: {
        type: String,
        required: [true, 'Please enter a email'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/,'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter the password'],
        minlength:[8, 'Password must be at least 8 character'],
        select:true // used to control select query - db.find(pw) . But usually production side it is set as false.
    },
    profileImage: {
        type:String,
        default:null
    }

},// collection's field
 {timestamps: true}); //options for mongoose. that's why it is seperate obj 


//middleware
//hashing the password before saving  // here it is async so no need to use next() because it is not a callback function.  if it was a callback function, we would have to call next() to move to the next middleware or to save the document. but since it is async, we can simply return a promise and mongoose will handle it for us.
userSchema.pre('save', async function(next){ //this is called when save is triggered whenever save is triggered - do this before saving 
    // if(!this.isModified('password')){ // isModified is a built - in function in mongoose where this represent curr user.  this is important step otherwise the pw might be rehashed again
    //     next();
    // }

    const salt=await bcrypt.genSalt(10); // random string added before hashing - gensalt is async() and it returns a promise so we need to await it.  2^10 = 1024 rounds of hashing or iterations. the higher the rounds, the more secure but also more time consuming. 10 is a good balance between security and performance.
    this.password = await bcrypt.hash(this.password,salt); 
} );


//compare password method not a middle ware. a method for each user doc. whereas middleware runs automatically
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model('User', userSchema); //converting schema into model. here 'User' means create a model User using userSchema. mongoose will automatically convert User into "users" collection

export default User;


//here the method macthpassword and pre('save =') is middleware because it is a function that runs before or after certain events. in this case, pre('save') runs before saving a document and matchPassword is a method that can be called on a user document to compare the entered password with the hashed password in the database.