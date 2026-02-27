import axiosInstance from '../utils/axiosinstance';
import { API_PATHS } from '../utils/apiPaths';

const generateFlashcards = async (documentId,options) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARDS, { documentId, ...options });
        return response.data;
    } 
    catch (error){
        throw error.response?.data || { message: "An unknown error occurred while generating flashcards." };

    }
};

const generateQuiz = async (documentId, options) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ, { documentId, ...options });
        return response.data;
    } 
    catch (error){
        throw error.response?.data || { message: "An unknown error occurred while generating quiz." };
    }
}

const generateSummary = async (documentId) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, { documentId });
        return response.data;
    }
    catch (error){
        throw error.response?.data || { message: "An unknown error occurred while generating summary." };
    }
};

const chat = async (documentId, message) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.CHAT, { documentId, question: message }); //Removed history from payload as backend will handle it
        return response.data;
    }
    catch (error){
        throw error.response?.data || { message: "An unknown error occurred while sending chat message." };
    }
};

const explainConcept = async (documentId,concept) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.EXPLAIN_CONCEPT, { documentId,concept });
        return response.data;
    }
    catch (error){
        throw error.response?.data || { message: "An unknown error occurred while explaining concept." };
    }
};

const getChatHistory = async (documentId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.AI.GET_CHAT_HISTORY(documentId));
        return response.data;
    }
    catch (error){
        throw error.response?.data || { message: "An unknown error occurred while fetching chat history." };
    }
};

const aiService = {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    chat,
    explainConcept,
    getChatHistory,
};

export default aiService;