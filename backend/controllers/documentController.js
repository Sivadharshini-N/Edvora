import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import { extractTextFromPDF} from '../utils/pdfParser.js';
import { chunkText } from '../utils/textChunker.js'; //import local modules - second party
import fs from 'fs/promises';// import 1st party modules provided by node.js itself. no need to install
import mongoose from 'mongoose'; // 3rd party


//@desc     uplaod PDF document
//@route    POST/api/documents/upload
//@access   private
export const uploadDocument = async (req,res,next) => {
    try{
        if(!req.file){
            return res.status(400).json({
                success: false,
                error:'Please upload a PDF file',
                statusCode:400
            });
        }
        const {title} = req.body;
        if(!title)
        {
            //delete uploaded file(present in /uploads/documents) if no title provided
            await fs.unlink(req.file.path); // file is being deleted from file system.
            return res.status(400).json({
                success:false,
                error:'Please provide a document title',
                statusCode:400
            });
        }

        //construct the url for the uploaded file
        const baseUrl = `http://localhost:${process.env.PORT||800}`;
        const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`;

        //create a document record
        const document = await Document.create({
            userId:req.user._id,
            title,
            fileName:req.file.originalname,
            filePath:fileUrl,//store the url instead of the local path
            fileSize:req.file.size,
            status:'processing'
        });

        //process pdf in background (in production, use a queue like bull)
        processPDF(document._id,req.file.path).catch(err=>{
            console.error('PDF processing error',err);
        });

        res.status(201).json({
            success:true,
            data:document,
            message:'Document uploaded successfully. Processing in progress...'

        });

    }
    catch(error){
        if(req.file){
            await fs.unlink(req.file.path).catch(()=>{});
        }
        next(error);

    }
};

//helper funciton to process pdf
const processPDF = async (documentId,filePath) => {
    try{
        console.log(`Starting PDF processing for ${documentId} from ${filePath}`);
        const {text} = await extractTextFromPDF(filePath);// destructuring is happening - only text is assigned whereas returned{text,numofpage,dat.info}

        console.log(`Extracted text length: ${text ? text.length : 0} characters`);
        
        //create chunks
        const chunks=chunkText(text,500,50);
        console.log(`Created ${chunks.length} chunks`);

        //update document
        const result = await Document.findByIdAndUpdate(documentId, {
            extractedText:text,
            chunks:chunks,
            status:'ready'
        }, {new:true});
        console.log(`Document ${documentId} processed successfully`);
    }
    catch(error){
        console.error(`Error processing document ${documentId}:`, error.message);
        console.error('Full error:', error);

        await Document.findByIdAndUpdate(documentId, {
            status:'failed'
        });

    }
}


//@desc     Get all user documents
//@route    GET/api/documents
//access    private
export const getDocuments = async (req,res,next) => {
    try{

        const documents = await Document.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(req.user._id)}// conveerting req.user_id into object id
            },
            {
                $lookup: {// more like a join in mongodb joining flascard collection
                    from: 'flashcards', 
                    localField: '_id',
                    foreignField:'documentId',
                    as:'flashcardSets'
                }
            },
            {
                $lookup: { //joining quizzes
                    from: 'quizzes',
                    localField:'_id',
                    foreignField:'documentId',
                    as:'quizzes'
                }
            },
            {
                $addFields:{ // just to maitain the count instead of storing whole collection
                    flashcardCount: {$size: '$flashcardSets'},
                    quizCount:{$size:'$quizzes'}
                }
            },
            {
                $project: { // project:0 -> dont select these fields
                    extractedText:0,
                    chunks:0,
                    flashcardSets:0,
                    quizzes:0
                }
            },
            {
                $sort:{uploadDate:-1} // sort based on uploaddate decsending 
            }
        ]);
        res.status(200).json({
            success:true,
            count:documents.length,
            data: documents
        });

    }
    catch(error){
        next();
    }
}

//@desc Get single document with chunks
//@route    GET/api/documents/:id
//@access   private
export const getDocument = async (req,res,next) => {
    try{
        const document = await Document.findOne({
            _id: req.params.id,
            userId:req.user._id
        });

        if(!document){
            return res.status(404).json({
                success:false,
                error:'Document not found',
                statusCode:404
            });
        }

        //get counts of associated flashcards and quizzes
        const flashcardCount = await Flashcard.countDocuments({documentId:document._id,userId: req.user._id});
        const quizCount = await Quiz.countDocuments({documentId:document._id,userId:req.user._id});

        //update last accessed
        document.lasstAccessed = Date.now();
        await document.save();

        //combine document data with counts
        const documentData = document.toObject(); // we are converting mongoose document into javascript object
        documentData.flashcardCount = flashcardCount;
        documentData.quizCount= quizCount;

        res.status(200).json({
            success: true,
            data:documentData
        });
    } catch (error){
        next(error);
    }

}


//@desc     delete a document
//@route    DELETE/api/documents/:id
//@access   private
export const deleteDocument = async (req,res,next) => {
    try{
        const document = await Document.findOne({
            _id:req.params.id,
            userId:req.user._id
        });

        if(!document){
            return res.status(404).json({
                success:false,
                error: 'Document not found',
                statusCode:404
            })
        }

        //delete file from fileSystem
        await fs.unlink(document.filePath).catch(() => {});

        await document.deleteOne();

        return res.status(200).json({
            success:true,
            message:'Document deleted successfully'
        });


    } catch (error){
        next(error);
    }
    
}


//@desc     update a document title
//@route    PUT/api/documents/:id
//@access   private
// export const updateDocument = async (req,res,next) => {
    
// }



