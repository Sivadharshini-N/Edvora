import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    title:{
        type:String,
        required: [true,'Please provide document title'],
        trim:true
    },
    fileName:{
        type:String,
        required:true
    },
    filePath:{
        type:String,
        required:true
    },
    fileSize:{
        type:Number,
        required:true
    },
    extractedText:{
        type:String,
        default:''
    },
    chunks:[{
        content:{
            type:String,
            required:true
        },
        pageNumber:{
            type:Number,
            required:true
        },
        chunkIndex:{
            type:Number,
            required:true
        }
    }],
    uploadedDate:{
        type:Date,
        default:Date.now()
    },
    lastAccessed:{
        type:Date,
        default:Date.now()
    },
    status:{
        type:String,
        enum:['processing','ready','failed'],
        default:'processing'
    }

},{timestamps:true});

documentSchema.index({userId:1, uploadedDate:-1});

const Document = mongoose.model('Document',documentSchema);

export default Document;