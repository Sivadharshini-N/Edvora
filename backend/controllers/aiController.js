import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import ChatHistory from '../models/ChatHistory.js';
import * as geminiService from '../utils/geminiService.js';
import { findRelevantChunks } from '../utils/textChunker.js';
import router from '../routes/aiRoutes.js';


//desc      Generate flashcards from document
//@route    POST/api/ai/generate-flashcards
//@access   private
export const generateFlashcards = async (req,res,next) => {
    try{
        const {documentId, count =10} = req.body;

        if(!documentId){
            return res.status(400).json({
                success:false,
                error:'Please provide documentId',
                statusCode:400
            });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });

        if(!document){
            return res.status(404).json({
                success:false,
                error:'Document not found or not ready',
                statusCode:404
            });
        }

        //Generate flashcards using Gemini
        const cards = await geminiService.generateFlashcards(
            document.extractedText,
            parseInt(count)
        );

        //save to database
        const flashcardSet = await Flashcard.create({
            userId: req.user._id,
            documentId: document._id,
            cards: cards.map(card => ({
                question: card.question,
                answer: card.answer,
                difficulty: card.difficulty,
                reviewCount:0,
                isStarred: false
            }))
        });
        res.status(201).json({
            success:true,
            data: flashcardSet,
            message: 'Flashcards generated successfully',
            statusCode:201
        });

    }
    catch(error){
        next(error);

    }
}



//desc      Generate quiz from document
//@route    POST/api/ai/generate-quiz
//@access   private
export const generateQuiz = async (req,res,next) => {
    try{
        const {documentId, numQuestions =5, title} = req.body;
        if(!documentId){
            return res.status(400).json({
                success:false,
                error:'Please provide documentId',
                statusCode:400
            });
        }
        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });

        if(!document){
            return res.status(404).json({
                success:false,
                error:'Document not found or not ready',
                statusCode:404
            });
        }

        //Generate quiz using Gemini
        const questions = await geminiService.generateQuiz(
            document.extractedText,
            parseInt(numQuestions)
        );

        //save to db
        const quiz = await Quiz.create({
            userId:req.user._id,
            documentId: document._id,
            title: title || `Quiz for ${document.title}`,
            questions: questions,
            totalQuestions: questions.length,
            userAnswers: [],
            score: 0
        });

        res.status(201).json({
            success:true,
            data: quiz,
            message:'Quiz generated successfully',
            statusCode:201
        });


    }
    catch(error){
        next(error);
        
    }
}


//desc      Generate document summary
//@route    POST/api/ai/generate-summary
//@access   private
export const generateSummary = async (req,res,next) => {
    try{
        const {documentId} = req.body;
        if(!documentId){
            return res.status(400).json({
                success:false,
                error:'Please provide documentId',
                statusCode:400
            });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });

        if(!document){
            return res.status(404).json({
                success:false,
                error:'Document not found or not ready',
                statusCode:404
            });
        }
        //generate summary using Gemini
        const summary = await geminiService.generateSummary(document.extractedText);
        res.status(200).json({
            success:true,
            data: {
                documentId: document._id,
                title: document.title,
                summary: summary
            },  
            message:'Summary generated successfully',
            statusCode:200
        });



    }
    catch(error){
        next(error);
        
    }
}




//desc      Chat with document
//@route    POST/api/ai/chat
//@access   private
export const chat = async (req,res,next) => {
    try{
        const {documentId,question} = req.body;
        if(!documentId || !question){
            return res.status(400).json({
                success:false,
                error: 'Please provide dcoumentId and question',
                statusCode:400
            });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });


        if(!document){
            return res.status(404).json({
                success:false,
                error:'Document not found or not ready',
                statusCode:404
            });
        }

        //find relevant chunks
        const relevantChunks = findRelevantChunks(document.chunks, question,3);
        const chunkIndices = relevantChunks.map(c => c.chunkIndex);

        let chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId: document._id
        });

        if(!chatHistory){
            chatHistory = await ChatHistory.create({
                userId: req.user._id,
                documentId: document._id,
                messages: []
            });
        }

        //generate response using Gemini
        const answer = await geminiService.chatWithContext(question, relevantChunks);

        //save convo
        chatHistory.messages.push(
            {
            role:'user',
            content: question,
            timestamp: new Date(),
            relavantChunks: []
        },
        {
            role:'assistant',
            content: answer,
            timestamp: new Date(),
            relavantChunks: chunkIndices

        });

    await chatHistory.save();

    res.status(200).json({
        success:true,
        data:{
            question,answer, relevantChunks: chunkIndices,
            ChatHistoryId: chatHistory._id
    
        },
        message: 'Chat response generated successfully',
        statusCode:200
    });
}   

    catch(error){
        next(error);
    }
}


//desc      explain the concept from the document
//@route    POST/api/ai/explain-concept
//@access   private
export const explainConcept = async (req,res,next) => {
    try{
        const { documentId, concept} = req.body;
        if(!documentId || !concept){
            return res.status(400).json({
                success:false,
                error:'Please provide documentId and concept',
                statusCode:400
            });
        }
        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        }); 

        if(!document){
            return res.status(404).json({
                success:false,
                error:'Document not found or not ready',
                statusCode:404
            });
        }
        //find relevant chunks for concept
        const relevantChunks = findRelevantChunks(document.chunks, concept,3);
        const context = relevantChunks.map(c=>c.content).join('\n\n');

        //generate explanation using gemini
        const explanation = await geminiService.explainConcept(concept, context);
        res.status(200).json({
            success:true,
            data:{
                concept,
                explanation,
                relevantChunks: relevantChunks.map(c=>c.chunkIndex)
            },
            message:'Concept explained successfully',
            statusCode:200
        });
    }
    catch(error){
        next(error);
    }
}


//desc      Get chat history for a document
//@route    GET/api/ai/chat-history/:documentId
//@access   private
export const getChatHistory = async (req,res,next) => {
    try{

        const {documentId} = req.params;
        if(!documentId){
            return res.status(400).json({
                success:false,
                error:'Please provide documentId',
                statusCode:400
            });
        }

        const chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId: documentId
        }).select('messages');

        if(!chatHistory){
            return res.status(200).json({
                success:true,
                data:[],
                message:'No chat history found for this document',
            });
        }
        res.status(200).json({
            success:true,
            data: chatHistory.messages,
            message:'Chat history retrieved successfully',
        });
    }
    catch(error){
        next(error);
    }
}




